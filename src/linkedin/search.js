// src/linkedin/search.js
import { humanDelay, humanScroll } from "./human.js";
import { getLogger } from "../logger/index.js";
import { config } from "../config/index.js";
import { state } from "../state/index.js";

const logger = getLogger(config);

/**
 * Search LinkedIn profiles using keywords and location
 * Resumes from last page if available in state
 */
export async function searchProfiles(page, {
  keywords,
  location,
  maxProfiles = 20,
  pageNumber = 1,
}) 
 {
  logger.info({ keywords, location }, "Starting LinkedIn profile search");

  const searchKey = `${keywords}_${location}`; // unique key per search
  let currentPage = pageNumber;
  const MAX_PAGES = 50; // max pages to avoid infinite scroll

  const profiles = new Set();

  while (profiles.size < maxProfiles && currentPage <= MAX_PAGES) {
    // Build search URL with current page
    let searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(keywords)}&origin=GLOBAL_SEARCH_HEADER`;
    if (location) searchUrl += `&location=${encodeURIComponent(location)}`;
    searchUrl += `&page=${currentPage}`;

    logger.info({ page: currentPage, url: searchUrl }, "Navigating to search page");
    await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
    await humanScroll(page);
    await humanDelay(1000, 2000);

    // Extract profile URLs on current page
    const links = await page.$$eval('a[href*="/in/"]', (anchors) =>
      anchors
        .map((a) => a.href.split("?")[0])
        .filter((href) => href.includes("/in/"))
    );

    let newProfiles = 0;
    for (const url of links) {
      if (!state.hasVisited(url) && !profiles.has(url)) {
        profiles.add(url);
        newProfiles++;
        logger.info({ url }, "Profile added");
      }
    }

    logger.info({ page: currentPage, totalCollected: profiles.size }, "Page scanned");

    // Save current page in state for continuation
    state.setLastSearchPage(searchKey, currentPage);

    if (newProfiles === 0) {
      logger.info("No new profiles found on this page, stopping search");
      break;
    }

    currentPage++;
    await humanDelay(1500, 3000);
  }

  return Array.from(profiles).slice(0, maxProfiles);
}
