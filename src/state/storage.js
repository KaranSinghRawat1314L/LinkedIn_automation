import fs from "fs";
import path from "path";
import { STATE_FILE } from "./constants.js";

export function loadState(defaultState = {}) {
  if (!fs.existsSync(STATE_FILE)) return defaultState;

  try {
    const raw = fs.readFileSync(STATE_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load state.json, using defaults", err);
    return defaultState;
  }
}

export function saveState(state) {
  try {
    fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
    fs.writeFileSync(
      STATE_FILE,
      JSON.stringify(state, null, 2),
      "utf-8"
    );
  } catch (err) {
    console.error("Failed to save state.json", err);
  }
}
