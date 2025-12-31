import { getLogger } from "../logger/index.js";
import { config } from "../config/index.js";
import { humanDelay } from "./human.js";

const logger = getLogger(config);

/**
 * Evaluates a LinkedIn profile for relevance
 * In SIMULATION mode, generates fake scores without real page interactions.
 * @param {import('playwright').Page} page
 * @param {string} profileUrl
 */
export async function evaluateProfile(page, profileUrl) {
  let score = 0;

  if (config.app.mode === "simulation") {
    // Generate a fake score (0-10) for demo purposes
    score = Math.floor(Math.random() * 10) + 1;

    logger.info(
      { profileUrl, score },
      "SIMULATION: Profile evaluation (fake score)"
    );

    await humanDelay(500, 1200); // keep human-like pause
    return { profileUrl, score };
  }

  // ===== LIVE evaluation (unchanged) =====
  try {
    await page.waitForSelector("main", { timeout: 15000 });
    await humanDelay(1200, 2000);

    /* ---------------- Mutual Connections ---------------- */
    const mutuals = await page.$$eval(
      'span',
      els =>
        els
          .map(e => e.textContent || "")
          .filter(t => t.toLowerCase().includes("mutual"))
    );
    score += mutuals.length * 3;

    /* ---------------- Headline / Industry ---------------- */
    const headline = await page.$eval(
      'div.text-body-medium',
      el => el.textContent || ""
    ).catch(() => "");
    if (/software|engineer|developer|backend|frontend/i.test(headline)) {
      score += 2;
    }

    /* ---------------- Education ---------------- */
    const educationText = await page.$$eval(
      'section',
      sections =>
        sections
          .map(s => s.textContent || "")
          .join(" ")
    );
    if (/computer|engineering|technology|university|iit|nit/i.test(educationText)) {
      score += 2;
    }

  } catch (err) {
    logger.warn(
      { profileUrl, err: err.message },
      "Profile evaluation partially failed"
    );
  }

  logger.info({ profileUrl, score }, "Profile evaluation completed");
  return { profileUrl, score };
}
