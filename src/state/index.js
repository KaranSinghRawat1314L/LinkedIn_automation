// src/state/index.js
import { loadState, saveState } from "./storage.js";

class StateManager {
  constructor() {
    const initial = loadState({}) || {};

    this.state = {
      visitedProfiles: new Set(initial.visitedProfiles || []),
      sentInvites: new Set(initial.sentInvites || []),
      sentMessages: new Set(initial.sentMessages || []),

      timestamps: initial.timestamps || {},
      dailyCounts: initial.dailyCounts || { connections: 0, messages: 0 },

      // ✅ Defensive init
      lastSearchPages: initial.lastSearchPages || {},
    };

  }

  // -------------------------
  // Persistence
  // -------------------------
  persist() {
    saveState({
      visitedProfiles: [...this.state.visitedProfiles],
      sentInvites: [...this.state.sentInvites],
      sentMessages: [...this.state.sentMessages],
      timestamps: this.state.timestamps,
      dailyCounts: this.state.dailyCounts,
      lastSearchPages: this.state.lastSearchPages,
    });
  }

  // -------------------------
  // Profile tracking
  // -------------------------
  hasVisited(url) {
    return this.state.visitedProfiles.has(url);
  }

  markVisited(url) {
    if (!this.state.visitedProfiles.has(url)) {
      this.state.visitedProfiles.add(url);
      this.persist();
    }
  }

  // -------------------------
  // Connection tracking
  // -------------------------
  hasSentInvite(url) {
    return this.state.sentInvites.has(url);
  }

  markInviteSent(url) {
    if (!this.state.sentInvites.has(url)) {
      this.state.sentInvites.add(url);
      this.state.dailyCounts.connections++;
      this.persist();
    }
  }

  getDailyConnections() {
    return this.state.dailyCounts.connections;
  }

  // -------------------------
  // Messaging tracking
  // -------------------------
  hasSentMessage(url) {
    return this.state.sentMessages.has(url);
  }

  markMessageSent(url) {
    if (!this.state.sentMessages.has(url)) {
      this.state.sentMessages.add(url);
      this.state.dailyCounts.messages++;
      this.persist();
    }
  }

  getDailyMessages() {
    return this.state.dailyCounts.messages;
  }

  // -------------------------
  // Timestamps
  // -------------------------
  setTimestamp(key) {
    this.state.timestamps[key] = Date.now();
    this.persist();
  }

  getTimestamp(key) {
    return this.state.timestamps[key] || null;
  }

  // -------------------------
  // Daily reset
  // -------------------------
  resetDailyCounts() {
    this.state.dailyCounts = { connections: 0, messages: 0 };
    this.persist();
  }

  // -------------------------
  // Search pagination continuation
  // -------------------------
  getLastSearchPage(searchKey) {
    return this.state.lastSearchPages[searchKey] ?? 1;
  }

  setLastSearchPage(searchKey, page) {
    this.state.lastSearchPages[searchKey] = page;
    this.persist();
  }

  // -------------------------
  // Debug
  // -------------------------
  dumpState() {
    return {
      visitedProfiles: [...this.state.visitedProfiles],
      sentInvites: [...this.state.sentInvites],
      sentMessages: [...this.state.sentMessages],
      timestamps: this.state.timestamps,
      dailyCounts: this.state.dailyCounts,
      lastSearchPages: this.state.lastSearchPages,
    };
  }
}

// Singleton
export const state = new StateManager();
