import { getLogger } from "../logger/index.js";
import { config } from "../config/index.js";

const logger = getLogger(config);

export async function handleCheckpoint(page) {
  const url = page.url();

  if (url.includes("/checkpoint/")) {
    logger.warn("Security checkpoint detected (CAPTCHA / 2FA)");

    logger.warn(
      "Automation paused. Please solve the challenge manually in the browser."
    );

    // Pause execution — human solves CAPTCHA
    await page.pause();

    logger.info("Resuming after manual checkpoint resolution");

    return true;
  }

  return false;
}
