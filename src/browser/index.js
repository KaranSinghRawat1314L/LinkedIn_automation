// src/browser/index.js
import { chromium } from "playwright";
import { getLogger } from "../logger/index.js";
import { config } from "../config/index.js";

const logger = getLogger(config);

export async function startBrowser() {
  logger.info("Launching browser (simulation-safe)");

  const browser = await chromium.launch({
    headless: false,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();

  if (config.app.mode === "simulation") {
    logger.info("SIMULATION MODE — opening LinkedIn homepage only");

    await page.goto("https://www.linkedin.com", {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    await page.waitForTimeout(3000);

    logger.info("SIMULATION MODE — closing browser");
    await browser.close();

    // 🔑 Return nulls so rest of system does not touch Playwright
    return { browser: null, page: null };
  }

  return { browser, page };
}
