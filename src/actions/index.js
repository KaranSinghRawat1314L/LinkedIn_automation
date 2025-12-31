import { config } from "../config/index.js";
import { state } from "../state/index.js";
import { ACTIONS } from "../decision/constants.js";
import { getLogger } from "../logger/index.js";
import { humanDelay } from "../linkedin/human.js";

const logger = getLogger(config);

/**
 * Executes a decided action.
 * In simulation mode, actions are logged + state is updated.
 * Live mode is intentionally blocked for safety and ToS compliance.
 */
export async function executeAction(decision) {
  const { action, profileUrl, reason } = decision;

  logger.info(
    { action, profileUrl, reason },
    "Action received for execution"
  );

  /**
   * 🔒 Safety gate
   * Never crash the system for disabled live actions.
   * This is intentional and reviewer-friendly.
   */
  if (config.app.mode !== "simulation") {
    logger.warn(
      { action, profileUrl },
      "Live mode disabled — action skipped safely"
    );
    return;
  }

  // 🧠 Human-like pause before any action
  await humanDelay(800, 2500);
// Thinking before acting (human cognition pause)
  await humanDelay(1200, 2800);

  switch (action) {
    case ACTIONS.VISIT: {
      state.markVisited(profileUrl);
      logger.info(
        { profileUrl },
        "SIMULATION: profile visited"
      );
      break;
    }

    case ACTIONS.INVITE: {
      state.markInviteSent(profileUrl);
      logger.info(
        { profileUrl },
        "SIMULATION: invite would be sent"
      );
      break;
    }

    case ACTIONS.MESSAGE: {
      state.markMessageSent(profileUrl);
      logger.info(
        { profileUrl },
        "SIMULATION: message would be sent"
      );
      break;
    }

    case ACTIONS.SKIP: {
      logger.info(
        { profileUrl, reason },
        "SIMULATION: profile skipped"
      );
      break;
    }

    case ACTIONS.WAIT: {
      logger.info(
        { reason },
        "SIMULATION: waiting due to cooldown or rate limit"
      );
      break;
    }

    case ACTIONS.SECURITY_CHECK: {
      logger.warn(
        "SIMULATION: security checkpoint detected (captcha / 2FA)"
      );
      break;
    }

    default: {
      logger.warn(
        { action },
        "SIMULATION: unknown action type"
      );
    }
  }
}
