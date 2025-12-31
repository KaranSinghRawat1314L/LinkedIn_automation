// src/decision/rules.js
import { state } from "../state/index.js";
import { DAILY_LIMITS } from "../state/constants.js";

/**
 * Check if profile can be visited
 * @param {string} profileUrl
 * @returns {boolean}
 */
export function canVisit(profileUrl) {
  return !state.hasVisited(profileUrl);
}

/**
 * Check if connection invite can be sent
 * @param {string} profileUrl
 * @returns {boolean}
 */
export function canSendInvite(profileUrl) {
  if (state.hasSentInvite(profileUrl)) return false;
  if (state.getDailyConnections() >= DAILY_LIMITS.connections) return false;
  return true;
}

/**
 * Check if message can be sent
 * @param {string} profileUrl
 * @returns {boolean}
 */
export function canSendMessage(profileUrl) {
  if (!state.hasSentInvite(profileUrl)) return false; // must be connected
  if (state.hasSentMessage(profileUrl)) return false;
  if (state.getDailyMessages() >= DAILY_LIMITS.messages) return false;
  return true;
}

/**
 * Detect if current page is a CAPTCHA/security checkpoint
 * @param {import('playwright').Page} page
 * @returns {Promise<boolean>}
 */
export async function isSecurityCheckpoint(page) {
  const captchaSelector = 'form[action*="captcha"]';
  const twoFASelector = 'input[name="pin"]';
  
  const captchaExists = await page.$(captchaSelector);
  const twoFAExists = await page.$(twoFASelector);

  return !!captchaExists || !!twoFAExists;
}
