// src/index.js
import { config } from "./config/index.js";
import { getLogger } from "./logger/index.js";
import { startBrowser } from "./browser/index.js";
import { restoreSession, persistSession } from "./session/index.js";
import { searchProfiles } from "./linkedin/search.js";
import { humanScroll, humanHover, humanDelay } from "./linkedin/human.js";
import { decideNextAction } from "./decision/index.js";
import { executeAction } from "./actions/index.js";
import { evaluateProfile } from "./linkedin/profileEvaluation.js";
import { generateMessage } from "./messaging/messageGenerator.js";
import { state } from "./state/index.js";

const logger = getLogger(config);

async function ensureLoggedIn(page) {
  if (!page) {
    logger.info("SIMULATION MODE — skipping login/session handling");
    return;
  }

  await restoreSession(page);
  await page.goto("https://www.linkedin.com/feed", { waitUntil: "load" });
  logger.info("SIMULATION MODE — session check complete");
}

async function processProfile(page, profileUrl, reuseEvaluation = null) {
  if (state.hasVisited(profileUrl)) return null;
  logger.info({ profileUrl }, "Processing profile (simulation)");

  await humanDelay(500, 1200);
  const evaluation = reuseEvaluation || (await evaluateProfile(page, profileUrl));
  const decision = decideNextAction(profileUrl);
  await executeAction(decision);

  // Generate draft message
  const draftMessage = generateMessage({
    profileUrl,
    score: evaluation.score,
    name: "Fake User",
    role: "Software Engineer",
  });

  state.markVisited(profileUrl);
  await humanDelay(800, 1500);

  return { evaluation, draftMessage };
}

async function main() {
  const { browser, page } = await startBrowser();

  try {
    logger.info("Running full pipeline in SIMULATION MODE");

    let profileUrls = [];

    if (config.app.mode === "simulation") {
      logger.info("SIMULATION MODE — generating fake profiles for demo");

      // 🔹 Example fake profiles
      profileUrls = [
        "https://linkedin.com/in/fake-user-1",
        "https://linkedin.com/in/fake-user-2",
        "https://linkedin.com/in/fake-user-3",
      ];
    } else {
      // ===== LIVE flow =====
      await ensureLoggedIn(page);

      const searchKey = `software engineer|India`;
      let currentPage = state.getLastSearchPage(searchKey) || 1;
      const maxProfiles = 20;

      while (profileUrls.length < maxProfiles) {
        const newProfiles = await searchProfiles(page, {
          keywords: "software engineer",
          location: "India",
          maxProfiles: maxProfiles - profileUrls.length,
          pageNumber: currentPage,
        });
        if (!newProfiles.length) break;
        profileUrls.push(...newProfiles);
        currentPage++;
        state.setLastSearchPage(searchKey, currentPage);
      }
    }

    const results = [];
    for (const url of profileUrls) {
      logger.info({ profileUrl: url }, "Processing profile (simulation)");

      // Evaluate profile (fake in simulation)
      const evaluation = await evaluateProfile(page, url);

      // Decide and execute action
      const decision = decideNextAction(url);
      await executeAction(decision);

      // Generate draft message
      const messagePayload = generateMessage(evaluation);

      results.push({
        ...evaluation,
        ...messagePayload,
      });
    }

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);

    logger.info({ results }, "SIMULATION COMPLETE — ranked profiles with drafted messages");

  } finally {
    if (browser) await browser.close();
  }
}

main().catch((err) => {
  logger.fatal(err, "Unexpected error in simulation mode");
  process.exit(1);
});
