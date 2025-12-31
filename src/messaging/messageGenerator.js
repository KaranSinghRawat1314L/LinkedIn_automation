import { getLogger } from "../logger/index.js";
import { config } from "../config/index.js";

const logger = getLogger(config);

/**
 * Message templates written like a HUMAN
 * Short, contextual, non-salesy
 */
const TEMPLATES = {
  HIGH_RELEVANCE: [
    ({ name, role }) =>
      `Hi ${name}, I came across your profile while exploring people working as ${role}. Your background stood out, so I thought I’d connect.`,

    ({ name, role }) =>
      `Hey ${name}, noticed you’re working as a ${role}. I’m exploring similar paths and would love to connect here.`
  ],

  MEDIUM_RELEVANCE: [
    ({ name }) =>
      `Hi ${name}, I came across your profile and thought it would be great to connect.`,

    ({ name }) =>
      `Hey ${name}, I’m growing my professional network and your profile looked interesting. Happy to connect!`
  ],

  LOW_RELEVANCE: [
    ({ name }) =>
      `Hi ${name}, hope you’re doing well. Sending a quick connection request.`
  ]
};

/**
 * Decide relevance bucket from score
 */
function getRelevanceBucket(score) {
  if (score >= 6) return "HIGH_RELEVANCE";
  if (score >= 3) return "MEDIUM_RELEVANCE";
  return "LOW_RELEVANCE";
}

/**
 * Picks a random message template safely
 */
function pickTemplate(bucket) {
  const list = TEMPLATES[bucket];
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Generates a human-like LinkedIn message (NO sending)
 *
 * @param {Object} profile
 * @param {string} profile.profileUrl
 * @param {number} profile.score
 * @param {string} [profile.name]
 * @param {string} [profile.role]
 *
 * @returns {Object} message payload
 */
export function generateMessage(profile) {
  const {
    profileUrl,
    score = 0,
    name = "there",
    role = "your field"
  } = profile;

  const bucket = getRelevanceBucket(score);
  const templateFn = pickTemplate(bucket);

  const message = templateFn({ name, role });

  const result = {
    profileUrl,
    relevance: bucket,
    score,
    message,
    generatedAt: Date.now()
  };

  logger.info(result, "Message generated (simulation only)");
  return result;
}
