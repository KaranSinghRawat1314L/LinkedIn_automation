// src/session/cookies.js
import fs from "fs";
import path from "path";

const SESSION_FILE = path.resolve("storage/session.json");

/**
 * Load cookies from the session file.
 * Returns an empty array if the file doesn't exist or is invalid.
 */
export function loadCookies() {
  try {
    if (!fs.existsSync(SESSION_FILE)) return [];
    const data = fs.readFileSync(SESSION_FILE, "utf-8");
    return JSON.parse(data) || [];
  } catch (err) {
    console.warn("Failed to load session cookies:", err);
    return [];
  }
}

/**
 * Save cookies to the session file.
 * Creates parent directories if missing.
 */
export function saveCookies(cookies) {
  try {
    fs.mkdirSync(path.dirname(SESSION_FILE), { recursive: true });
    fs.writeFileSync(SESSION_FILE, JSON.stringify(cookies, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to save session cookies:", err);
  }
}
