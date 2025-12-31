// src/linkedin/connect.js
import { humanDelay, humanHover } from "./human.js";
import { getLogger } from "../logger/index.js";

const logger = getLogger(config)
/**
 * Simulates sending a LinkedIn connection request
 * @param {import('playwright').Page} page
 * @param {boolean} [simulate=true] - if true, do not click, just simulate
 */
export async function sendConnectionRequest(page, simulate = true) {
  logger.info("Attempting to send connection request");

  const connectBtnSelector = 'button:has-text("Connect")';
  const connectBtn = await page.$(connectBtnSelector);

  if (!connectBtn) {
    logger.warn("Connect button not found");
    return false;
  }

  // Human-like hover & slight movement
  await humanHover(page, connectBtnSelector);

  // Small random delay before action
  await humanDelay(300, 800);

  if (!simulate) {
    await connectBtn.click();
    logger.info("Connection request clicked");
  } else {
    logger.info("Connection request simulated (no click)");
  }

  // Optional small delay after clicking
  await humanDelay(300, 600);

  return true;
}
