/**
 * Manually generate the Allure report from the existing allure-results and email it,
 * regardless of EMAIL_NOTIFICATION / EMAIL_SEND_ON (SMTP and recipients still come from .env).
 *
 * Usage: npm run report:email
 */

import Logger from "../utils/logger";
import { notify } from "./notify";

notify(true).catch((error) => {
  Logger.error(
    `Report email failed: ${error instanceof Error ? error.message : String(error)}`,
  );
  process.exit(1);
});
