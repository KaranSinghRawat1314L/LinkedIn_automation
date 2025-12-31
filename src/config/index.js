import dotenv from "dotenv";

dotenv.config();

/**
 * Application configuration
 * Immutable, validated, environment-driven
 */
function loadConfig() {
  const config = {
    app: {
      mode: getEnv("MODE", "simulation"),
      logLevel: getEnv("LOG_LEVEL", "info"),
    },

    linkedin: {
      email: getEnv("LINKEDIN_EMAIL", null),
      password: getEnv("LINKEDIN_PASSWORD", null),
      authStrategy: getEnv("LINKEDIN_AUTH_STRATEGY", "session"), 
      // session | credentials
    },
  };

  validateConfig(config);
  return Object.freeze(config);
}

/**
 * Environment helpers
 */
function getEnv(key, defaultValue = null) {
  return process.env[key] ?? defaultValue;
}

/**
 * Centralized validation
 */
function validateConfig(config) {
  validateMode(config.app.mode);
  validateLinkedInAuth(config.linkedin);
}

/**
 * Mode validation
 */
function validateMode(mode) {
  const allowed = ["simulation", "live"];

  if (!allowed.includes(mode)) {
    throw new Error(`Invalid MODE: ${mode}`);
  }

  if (mode === "live") {
    throw new Error(
      "Live mode is intentionally disabled in this POC"
    );
  }
}

/**
 * LinkedIn auth validation (future-safe)
 */
function validateLinkedInAuth(linkedin) {
  const allowedStrategies = ["session", "credentials"];

  if (!allowedStrategies.includes(linkedin.authStrategy)) {
    throw new Error(
      `Invalid LINKEDIN_AUTH_STRATEGY: ${linkedin.authStrategy}`
    );
  }

  if (linkedin.authStrategy === "credentials") {
    if (!linkedin.email || !linkedin.password) {
      throw new Error(
        "LINKEDIN_EMAIL and LINKEDIN_PASSWORD are required for credentials auth"
      );
    }
  }
}

export const config = loadConfig();
