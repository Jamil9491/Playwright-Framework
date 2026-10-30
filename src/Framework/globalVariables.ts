/**
 * Global Variables
 * Shared, run-scoped storage for values that need to pass between steps,
 * pages and hooks (e.g. an order number created in one step and verified in another).
 *
 * Note: with `cucumber-js --parallel N` each worker is a separate Node process,
 * so every worker gets its own isolated copy of this store.
 */

// ── Typed key enum ────────────────────────────────────────────────────────

export enum GlobalKey {
    ILC_SIGHT_REF_NUMB = 'ILC_SIGHT_REF_NUMB',
    CustomerName = 'CustomerName',
    BP_ID = 'BP_ID',

    // Session / environment
    UserId = 'UserId',
    EnvironmentName = 'EnvironmentName',
    TestRunId = 'TestRunId',
    DbConnectionString = 'DbConnectionString',

    // RegionCode
    RegionCode = 'RegionCode',

    // Flow control
    HaltTest = 'HaltTest',

    // File name shared between different steps
    SharedFile = 'SharedFile',
}

/** Defaults returned by getRequired() when a key has no value. */
const KEY_DEFAULTS: Partial<Record<GlobalKey, string>> = {
    [GlobalKey.HaltTest]: 'no',
};

export class GlobalVariables {
  // ── Typed string bag ─────────────────────────────────────────────────────

  private static readonly bag = new Map<GlobalKey, string>();

  public static set(key: GlobalKey, value: string): void {
    if (value === null || value === undefined) {
      throw new Error(
        `Value for GlobalKey '${key}' cannot be null or undefined.`,
      );
    }
    GlobalVariables.bag.set(key, value);
  }

  /** Removes a single typed key from the bag. */
  public static reset(key: GlobalKey): void {
    GlobalVariables.bag.delete(key);
  }

  /** Returns the value, or undefined if the key has not been set. */
  public static tryGet(key: GlobalKey): string | undefined {
    return GlobalVariables.bag.get(key);
  }

  /** Returns the value, or the key's default (empty string unless configured) if missing/empty. */
  public static getRequired(key: GlobalKey): string {
    const value = GlobalVariables.bag.get(key);
    return value ? value : (KEY_DEFAULTS[key] ?? "");
  }

  // ── Shorthand properties ─────────────────────────────────────────────────

  public static get ILC_SIGHT_REF_NUMB(): string {
    return GlobalVariables.getRequired(GlobalKey.ILC_SIGHT_REF_NUMB);
  }

  public static get CUSTOMER_NAME(): string {
    return GlobalVariables.getRequired(GlobalKey.CustomerName);
  }
  public static get USER_ID(): string {
    return GlobalVariables.getRequired(GlobalKey.UserId);
  }
  public static get ENVIRONMENT_NAME(): string {
    return GlobalVariables.getRequired(GlobalKey.EnvironmentName);
  }
  public static get DB_CONNECTION_STRING(): string {
    return GlobalVariables.getRequired(GlobalKey.DbConnectionString);
  }
  public static get REGION_CODE(): string {
    return GlobalVariables.getRequired(GlobalKey.RegionCode);
  }

  public static get TEST_RUN_ID(): string {
    return GlobalVariables.getRequired(GlobalKey.TestRunId);
  }
  public static get IS_HALT_TEST(): boolean {
    return (
      GlobalVariables.getRequired(GlobalKey.HaltTest).toLowerCase() === "yes"
    );
  }
  public static get SHARED_FILE(): string {
    return GlobalVariables.getRequired(GlobalKey.SharedFile);
  }

  // ── Login session record ─────────────────────────────────────────────────
  // Saved on first successful login so recovery can replay login automatically.

  public static LoginScriptId = "";
  public static LoginWorkbook = "";
  public static LoginSheet = "";
  public static LoginIteration = "";

  // ── Excel suite run ──────────────────────────────────────────────────────
  // Set by the hooks for each scenario started from the test-suite workbook (runSuite.ts).
  // Iteration is the data variation of the current row (e.g. "DV_3"); tables are already
  // trimmed to it, so steps only need it for their own lookups.

  public static Seq_Id = "";
  public static WorkFlow_Desc = "";
  public static Iteration = "";

  public static get HAS_LOGIN_RECORD(): boolean {
    return !!GlobalVariables.LoginScriptId && !!GlobalVariables.LoginWorkbook;
  }

  // ── Dynamic / arbitrary bag ───────────────────────────────────────────────
  // Use this for test-run-specific values that don't deserve a typed key,
  // e.g. intermediate lookup results, dynamic IDs, table cell values.
  // Keys are case-insensitive.

  private static readonly dynamicBag = new Map<string, unknown>();

  private static normalize(key: string): string {
    return key.toLowerCase();
  }

  /** Stores any value under a free-form string key. */
  public static setDynamic(key: string, value: unknown): void {
    if (key === null || key === undefined) {
      throw new Error("Dynamic key cannot be null or undefined.");
    }
    if (value === null || value === undefined) {
      throw new Error(
        `Value for dynamic key '${key}' cannot be null or undefined.`,
      );
    }
    GlobalVariables.dynamicBag.set(GlobalVariables.normalize(key), value);
  }

  /**
   * Retrieves a dynamic value. Throws if the key is absent.
   * Pass a converter (e.g. Number, String, Boolean) to coerce the stored value.
   */
  public static getDynamic<T>(key: string, convert?: (raw: unknown) => T): T {
    const normalized = GlobalVariables.normalize(key);
    if (!GlobalVariables.dynamicBag.has(normalized)) {
      throw new Error(`Dynamic key '${key}' not found in GlobalVariables.`);
    }
    const raw = GlobalVariables.dynamicBag.get(normalized);
    return convert ? convert(raw) : (raw as T);
  }

  /**
   * Tries to get a dynamic value, returning defaultValue if the key is absent
   * or the converter throws / yields NaN.
   */
  public static tryGetDynamic<T>(
    key: string,
    defaultValue: T,
    convert?: (raw: unknown) => T,
  ): T {
    const normalized = GlobalVariables.normalize(key);
    if (GlobalVariables.dynamicBag.has(normalized)) {
      try {
        const raw = GlobalVariables.dynamicBag.get(normalized);
        const value = convert ? convert(raw) : (raw as T);
        if (!(typeof value === "number" && Number.isNaN(value))) {
          return value;
        }
      } catch {
        /* fall through */
      }
    }
    return defaultValue;
  }

  /** Removes a dynamic key. */
  public static resetDynamic(key: string): void {
    GlobalVariables.dynamicBag.delete(GlobalVariables.normalize(key));
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────

  /** Clears both the typed bag and the dynamic bag. Call at scenario teardown. */
  public static clear(): void {
    GlobalVariables.bag.clear();
    GlobalVariables.dynamicBag.clear();
  }
}

export default GlobalVariables;
