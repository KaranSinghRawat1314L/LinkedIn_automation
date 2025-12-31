// src/session/index.js
import { loadCookies, saveCookies } from "./cookies.js";
import { getLogger } from "../logger/index.js";
import { config } from "../config/index.js";

const logger = getLogger(config);

export async function restoreSession(page) {
  try {
    const cookies = loadCookies();
    if (!cookies?.length) {
      logger.info("No existing session found");
      return false;
    }

    await page.context().addCookies(cookies);
    logger.info("Session restored from cookies");
    return true;
  } catch (err) {
    logger.warn(err, "Failed to restore session");
    return false;
  }
}

export async function persistSession(page) {
  try {
    const cookies = await page.context().cookies();
    saveCookies(cookies);
    logger.info("Session persisted");
  } catch (err) {
    logger.warn(err, "Failed to persist session");
  }
}
