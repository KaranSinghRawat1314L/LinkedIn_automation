// src/linkedin/visit.js
import { humanDelay, humanScroll } from "./human.js";
import { getLogger } from "../logger/index.js";
import { config } from "../config/index.js";

const logger = getLogger(config)

export async function visitProfile(page, profileUrl) {
  logger.info({ profileUrl }, "Visiting LinkedIn profile");

  await page.goto(profileUrl, { waitUntil: "domcontentloaded" });

  await humanDelay();
  await humanScroll(page);
}
