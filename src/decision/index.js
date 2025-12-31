// src/decision/index.js
import { ACTIONS } from "./constants.js";
import {
  canVisit,
  canSendInvite,
  canSendMessage,
} from "./rules.js";

/**
 * Central decision engine.
 * Determines the next safe action for a given profile.
 */
export function decideNextAction(profileUrl) {
  if (!profileUrl) {
    return {
      action: ACTIONS.SKIP,
      profileUrl: null,
      reason: "Invalid profile URL",
    };
  }

  // 1️⃣ Visit profile (lowest risk, required for context)
  if (canVisit(profileUrl)) {
    return decision(
      ACTIONS.VISIT,
      profileUrl,
      "Profile has not been visited yet"
    );
  }

  // 2️⃣ Send connection invite (rate-limited)
  if (canSendInvite(profileUrl)) {
    return decision(
      ACTIONS.INVITE,
      profileUrl,
      "Eligible for connection request"
    );
  }

  // 3️⃣ Send follow-up message (only after connection)
  if (canSendMessage(profileUrl)) {
    return decision(
      ACTIONS.MESSAGE,
      profileUrl,
      "Connection exists, message pending"
    );
  }

  // 4️⃣ No safe action
  return decision(
    ACTIONS.SKIP,
    profileUrl,
    "All actions exhausted or rate-limited"
  );
}

/**
 * Standard decision object factory
 */
function decision(action, profileUrl, reason) {
  return {
    action,
    profileUrl,
    reason,
    decidedAt: Date.now(),
  };
}
