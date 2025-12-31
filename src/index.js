import { config } from "./config/index.js";
import { getLogger } from "./logger/index.js";
import { startBrowser } from "./browser/index.js";
import { restoreSession, persistSession } from "./session/index.js";
import { searchProfiles } from "./linkedin/search.js";
import { humanScroll, humanHover, humanDelay } from "./linkedin/human.js";
import { decideNextAction } from "./decision/index.js";
import { executeAction } from "./actions/index.js";
import { evaluateProfile } from "./linkedin/profileEvaluation.js";
import { state } from "./state/index.js";

const logger = getLogger(config);

/** Generate fake profile URLs for simulation */
function generateFakeProfileUrls(count = 10) {
  return Array.from({ length: count }, (_, i) => `https://linkedin.com/in/fake-user-${i + 1}`);
}

/** Main entry point */
async function main() {
  const IS_SIMULATION = config.app.mode === "simulation";

  let browser, page;

  if (!IS_SIMULATION) {
    ({ browser, page } = await startBrowser());
    await restoreSession(page);
    await ensureLoggedIn(page);
  }

  /** Step 1: Get profiles */
  let profileUrls = [];

  if (IS_SIMULATION) {
    logger.info("SIMULATION MODE — generating fake profiles");
    profileUrls = generateFakeProfileUrls(20);
  } else {
    profileUrls = await searchProfiles(page, {
      keywords: "software engineer",
      location: "India",
      maxProfiles: 20,
    });
  }

  const scored = [];

  /** Step 2: Process profiles */
  for (const profileUrl of profileUrls) {
    if (state.hasVisited(profileUrl)) {
      logger.info({ profileUrl }, "Already visited — skipping");
      continue;
    }

    logger.info({ profileUrl }, "Processing profile");

    /** Step 2a: Evaluate profile */
    const evaluation = IS_SIMULATION
      ? await evaluateProfile(page || {}, profileUrl) // still call real function; page is empty object in simulation
      : await evaluateProfile(page, profileUrl);

    scored.push(evaluation);

    /** Step 2b: Decide next action */
    const decision = decideNextAction(profileUrl);

    /** Step 2c: Execute action (simulation mode blocks real clicks) */
    if (IS_SIMULATION) {
      logger.info(
        { decision },
        "SIMULATION MODE — action recorded but not executed"
      );
      await executeAction(decision); // executor will detect simulation and only update state/log
    } else {
      await executeAction(decision);
    }

    /** Human-like delay */
    await humanDelay(1000, 2500);
  }

  /** Step 3: Rank & log results */
  scored.sort((a, b) => b.score - a.score);
  logger.info({ scored }, "Pipeline complete — ranked profiles");

  if (browser) await browser.close();
}

main().catch((err) => {
  logger.fatal(err, "Unexpected error");
  process.exit(1);
});

/** Helper to ensure LinkedIn login for live mode */
async function ensureLoggedIn(page) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      logger.info({ attempt }, "Navigating to LinkedIn feed");
      await page.goto("https://www.linkedin.com/feed", {
        timeout: 45000,
        waitUntil: "load",
      });
      break;
    } catch (err) {
      logger.warn({ attempt }, "Feed load failed, retrying");
      if (attempt === 2) throw err;
    }
  }

  if (!page.url().includes("/login")) {
    logger.info("Session already active");
    return;
  }

  logger.warn("Login required");

  if (!config.linkedin.email || !config.linkedin.password) {
    throw new Error("Missing LinkedIn credentials");
  }

  await page.waitForSelector("#username", { timeout: 20000 });
  await page.waitForSelector("#password", { timeout: 20000 });

  await page.type("#username", config.linkedin.email, { delay: Math.random() * 80 + 40 });
  await page.type("#password", config.linkedin.password, { delay: Math.random() * 80 + 40 });

  logger.info("Credentials filled — complete login manually (30s)");
  await page.waitForTimeout(30000);

  if (page.url().includes("/login")) {
    throw new Error("Login not completed");
  }

  await persistSession(page);
  logger.info("Login successful — session saved");
}
