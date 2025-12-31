import { humanDelay } from "./human.js";
import { getLogger } from "../logger/index.js";
import { config } from "../config/index.js";

const logger = getLogger(config)

/**
 * Simulates human typing with variable delays and optional mistakes
 * @param {import('playwright').Page} page 
 * @param {string} text 
 */
export async function sendMessage(page, text) {
  logger.info("Simulating message typing");

  for (const char of text) {
    // Randomized delay between keystrokes (40ms to 160ms)
    const delay = Math.random() * 120 + 40;

    // Occasionally simulate typo with backspace (5% chance per char)
    if (Math.random() < 0.05) {
      const typoChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
      await page.keyboard.type(typoChar, { delay });
      await page.keyboard.press("Backspace");
    }

    await page.keyboard.type(char, { delay });
  }

  // Short delay after finishing message
  await humanDelay(300, 700);

  // Optional: uncomment to send the message
  // await page.keyboard.press("Enter");

  logger.info("Message simulated");
}
