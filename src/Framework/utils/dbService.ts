/**
 * Database Service
 * Handles connecting to PostgreSQL and executing queries.
 * Uses the 'pg' library with a connection pool.
 *
 * Always pass user/test values as parameters ($1, $2, ...) rather than
 * concatenating them into the SQL string, to avoid SQL injection and quoting bugs:
 *     await dbService.getSingleValue('SELECT name FROM users WHERE id = $1', [userId]);
 *
 * Note: Postgres BIGINT / NUMERIC columns come back as strings (to avoid precision
 * loss) and unquoted column names are returned in lowercase.
 */

import { Pool, PoolClient, PoolConfig, QueryResult, QueryResultRow } from "pg";
import { config } from "../config/config";
import Logger from "./logger";
import { GlobalKey, GlobalVariables } from "./globalVariables";

/** A single result row: column name -> value. */
export type DbRow = QueryResultRow;

/** Anything that can run a query: the pool itself or a client inside a transaction. */
type Queryable = Pick<Pool, "query"> | PoolClient;

export interface PollOptions {
  /** Max time to keep polling. Default: 90 seconds. */
  timeoutMs?: number;
  /** Wait between attempts. Default: 2 seconds. */
  intervalMs?: number;
  /** Wait before the first attempt (e.g. while a batch job starts). Default: 0. */
  initialDelayMs?: number;
}

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

class DbService {
  private pool: Pool | null = null;
  private logger = Logger;

  /**
   * Builds the pool configuration from config / .env.
   * DB_CONNECTION_STRING takes precedence over the individual DB_* settings.
   */
  private buildPoolConfig(): PoolConfig {
    const common: PoolConfig = {
      max: config.DB_POOL_MAX,
      query_timeout: config.DB_QUERY_TIMEOUT,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      ssl: config.DB_SSL ? { rejectUnauthorized: false } : undefined,
    };

    if (config.DB_CONNECTION_STRING) {
      return { ...common, connectionString: config.DB_CONNECTION_STRING };
    }

    if (!config.DB_NAME || !config.DB_USER) {
      throw new Error(
        "Database is not configured. Set DB_CONNECTION_STRING or DB_HOST/DB_NAME/DB_USER/DB_PASSWORD in .env",
      );
    }

    return {
      ...common,
      host: config.DB_HOST,
      port: config.DB_PORT,
      database: config.DB_NAME,
      user: config.DB_USER,
      password: config.DB_PASSWORD,
    };
  }

  /**
   * Returns the pool, creating it on first use so tests that never touch
   * the database don't need DB settings.
   */
  private getPool(): Pool {
    if (!this.pool) {
      this.pool = new Pool(this.buildPoolConfig());
      this.pool.on("error", (err) =>
        this.logger.error(
          "Unexpected idle PostgreSQL client error:",
          err.message,
        ),
      );
      this.logger.info("PostgreSQL connection pool created.");
    }
    return this.pool;
  }

  /** Runs a query, logging the SQL and timing. Throws on failure. */
  private async run<T extends DbRow>(
    sql: string,
    params: unknown[] = [],
    executor?: Queryable,
  ): Promise<QueryResult<T>> {
    const start = Date.now();
    this.logger.debug(
      `SQL: ${sql.replace(/\s+/g, " ").trim()} | params: ${JSON.stringify(params)}`,
    );

    try {
      const result = await (executor ?? this.getPool()).query<T>(sql, params);
      this.logger.debug(
        `SQL completed in ${Date.now() - start}ms, rows: ${result.rowCount ?? 0}`,
      );
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`SQL failed: ${message}`);
      throw new Error(`Database query failed: ${message}`);
    }
  }

  // ── Connection ───────────────────────────────────────────────────────────

  /** Verifies the database is reachable. Returns false instead of throwing. */
  public async testConnection(): Promise<boolean> {
    try {
      await this.run("SELECT 1");
      this.logger.info("✅ PostgreSQL connection successful.");
      return true;
    } catch (error) {
      this.logger.error(
        "❌ PostgreSQL connection failed:",
        error instanceof Error ? error.message : error,
      );
      return false;
    }
  }

  /** Closes all pooled connections. Call once in AfterAll. */
  public async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      this.logger.info("PostgreSQL connection pool closed.");
    }
  }

  // ── Read queries ─────────────────────────────────────────────────────────

  /**
   * Executes a query and returns all rows.
   * @example const users = await dbService.getRows<{ id: number; email: string }>('SELECT id, email FROM users');
   */
  public async getRows<T extends DbRow = DbRow>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    const result = await this.run<T>(sql, params);
    if (result.rows.length === 0) {
      this.logger.warn("⚠️ No rows returned from the database.");
    }
    return result.rows;
  }

  /** Executes a query and returns the first row, or null if there are none. */
  public async getFirstRow<T extends DbRow = DbRow>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T | null> {
    const result = await this.run<T>(sql, params);
    if (result.rows.length === 0) {
      this.logger.warn("⚠️ No rows returned from the database.");
    }
    return result.rows[0] ?? null;
  }

  /**
   * Executes a query and returns the first column of the first row, or null if no data.
   * @example const count = Number(await dbService.getSingleValue('SELECT COUNT(*) FROM orders WHERE user_id = $1', [id]));
   */
  public async getSingleValue<T = string>(
    sql: string,
    params: unknown[] = [],
  ): Promise<T | null> {
    const row = await this.getFirstRow(sql, params);
    if (!row) {
      this.logger.warn("No data found for single-value query.");
      return null;
    }
    const firstColumn = Object.keys(row)[0];
    const value = row[firstColumn];
    return value === null || value === undefined ? null : (value as T);
  }

  /** Executes a query and returns every value of one column. */
  public async getColumnValues<T = string>(
    sql: string,
    column: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    const rows = await this.getRows(sql, params);
    if (rows.length > 0 && !(column in rows[0])) {
      throw new Error(
        `Column '${column}' not found in result. Available: ${Object.keys(rows[0]).join(", ")}`,
      );
    }
    return rows
      .map((row) => row[column] as T)
      .filter((value) => value !== null && value !== undefined);
  }

  /** Executes a query and returns true if it produced at least one row. */
  public async exists(sql: string, params: unknown[] = []): Promise<boolean> {
    const result = await this.run(sql, params);
    return (result.rowCount ?? 0) > 0;
  }

  /**
   * Executes a query that returns one value and stores it in GlobalVariables,
   * so later steps can read it (e.g. GlobalVariables.getRequired(GlobalKey.CustomerName)).
   * Returns an empty string if nothing was found.
   */
  public async fetchAndStore(
    key: GlobalKey,
    sql: string,
    params: unknown[] = [],
  ): Promise<string> {
    const value = await this.getSingleValue(sql, params);
    if (value === null) {
      this.logger.warn(`No value found to store for GlobalKey '${key}'.`);
      return "";
    }
    const text = String(value);
    GlobalVariables.set(key, text);
    this.logger.info(`Stored ${key} = ${text}`);
    return text;
  }

  // ── Write queries ────────────────────────────────────────────────────────

  /**
   * Executes INSERT / UPDATE / DELETE (or DDL) and returns the number of affected rows.
   * @example await dbService.execute('UPDATE orders SET status = $1 WHERE id = $2', ['Cancelled', orderId]);
   */
  public async execute(sql: string, params: unknown[] = []): Promise<number> {
    const result = await this.run(sql, params);
    return result.rowCount ?? 0;
  }

  /**
   * Runs several statements in a single transaction. Commits if the callback
   * succeeds, rolls back and rethrows if it throws.
   * @example
   * await dbService.withTransaction(async tx => {
   *     await tx.execute('DELETE FROM cart_items WHERE user_id = $1', [userId]);
   *     await tx.execute('DELETE FROM carts WHERE user_id = $1', [userId]);
   * });
   */
  public async withTransaction<T>(
    callback: (tx: {
      getRows: <R extends DbRow = DbRow>(
        sql: string,
        params?: unknown[],
      ) => Promise<R[]>;
      execute: (sql: string, params?: unknown[]) => Promise<number>;
    }) => Promise<T>,
  ): Promise<T> {
    const client = await this.getPool().connect();
    const tx = {
      getRows: async <R extends DbRow = DbRow>(
        sql: string,
        params: unknown[] = [],
      ) => (await this.run<R>(sql, params, client)).rows,
      execute: async (sql: string, params: unknown[] = []) =>
        (await this.run(sql, params, client)).rowCount ?? 0,
    };

    try {
      await client.query("BEGIN");
      const result = await callback(tx);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      this.logger.error("Transaction rolled back.");
      throw error;
    } finally {
      client.release();
    }
  }

  // ── Polling ──────────────────────────────────────────────────────────────

  /**
   * Re-runs a query until the condition is met on the returned rows or the timeout expires.
   * Useful for waiting on background jobs / async processing.
   *
   * Returns the rows that matched, or (on timeout) the last non-empty rows seen,
   * or an empty array if nothing was ever returned.
   *
   * @example
   * const rows = await dbService.pollUntil(
   *     'SELECT status FROM jobs WHERE file_name LIKE $1 ORDER BY id DESC',
   *     [`%${fileName}%`],
   *     rows => rows.some(r => String(r.status).toLowerCase() === 'completed'),
   *     { timeoutMs: 90000, initialDelayMs: 5000 },
   * );
   */
  public async pollUntil<T extends DbRow = DbRow>(
    sql: string,
    params: unknown[],
    condition: (rows: T[]) => boolean,
    options: PollOptions = {},
  ): Promise<T[]> {
    const {
      timeoutMs = 90000,
      intervalMs = 2000,
      initialDelayMs = 0,
    } = options;
    let lastKnownRows: T[] = [];
    let attempt = 0;

    if (initialDelayMs > 0) await sleep(initialDelayMs);
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      attempt++;
      try {
        const rows = (await this.run<T>(sql, params)).rows;
        if (rows.length > 0) {
          lastKnownRows = rows;
          const matched = condition(rows);
          this.logger.info(
            `Poll attempt ${attempt}: ${rows.length} row(s), condition met: ${matched}`,
          );
          if (matched) return rows;
        }
      } catch (error) {
        this.logger.error(
          `Poll attempt ${attempt} failed:`,
          error instanceof Error ? error.message : error,
        );
      }
      await sleep(intervalMs);
    }

    this.logger.warn(
      `Polling timed out after ${timeoutMs}ms; returning last known rows (${lastKnownRows.length}).`,
    );
    return lastKnownRows;
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Formats rows as "column: value" lines, handy for logs or Allure attachments. */
  public static formatRows(rows: DbRow[]): string {
    return rows
      .map((row) =>
        Object.entries(row)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n"),
      )
      .join("\n-------------------\n");
  }
}

// Export a singleton instance
export const dbService = new DbService();
export { DbService };
