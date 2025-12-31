import path from "path";

// -------------------------
// Daily limits (safety)
// -------------------------
export const DAILY_LIMITS = {
  connections: 20,
  messages: 50,
};

// -------------------------
// Cooldowns
// -------------------------
export const COOLDOWNS = {
  actionMs: 5000,
};

// -------------------------
// Storage
// -------------------------
export const STATE_FILE = path.resolve(
  process.cwd(),
  "storage/state.json"
);

// -------------------------
// Timestamp keys
// -------------------------
export const TIMESTAMP_KEYS = {
  lastConnection: "lastConnection",
  lastMessage: "lastMessage",
};
