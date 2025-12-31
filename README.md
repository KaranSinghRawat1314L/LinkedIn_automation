# LinkedIn Automation — Simulation-First Stealth Automation POC

## 📖 Overview
This repository demonstrates **advanced browser automation architecture**, **human-like behavior modeling**, and **anti-detection strategies** in a **simulation-first environment**.

> **⚠️ Educational Proof-of-Concept Only**  
> Live automation is **intentionally disabled** to prevent misuse and Terms of Service violations. This project exists solely to showcase automation engineering patterns and stealth techniques.

The system focuses on:
- **Clean, modular automation architecture**
- **Human-like behavior simulation** (timing, motion, interaction)
- **Stealth-aware design choices**
- **Deterministic state tracking** and decision-making
- **Safe-by-default execution** via simulation mode

## 🏗️ High-Level Architecture
┌──────────────────────┐
│      index.js        │
│  (Orchestrator)      │
└─────────┬────────────┘
          │
          ▼
┌──────────────────────────────┐
│        Config Layer          │
│  - env validation            │
│  - mode enforcement          │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│     Browser / Session        │
│  - Playwright Chromium       │
│  - Cookie persistence        │
│  - Login & checkpoint detect │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│      Search Pipeline         │
│  - Keyword-based search      │
│  - Pagination handling       │
│  - Deduplication             │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│   Profile Evaluation Engine  │
│  - Relevance scoring         │
│  - Simulation-safe fallback  │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│    Decision Engine           │
│  - Rule-based actions        │
│  - Rate & state aware        │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│     Action Executor          │
│  - Safety gate               │
│  - Simulation-only actions   │
└─────────┬────────────────────┘
          │
          ▼
┌──────────────────────────────┐
│       State Layer            │
│  - Visited profiles          │
│  - Invites & messages        │
│  - Daily limits              │
└──────────────────────────────┘

## 🚀 Execution Modes

### **Simulation Mode (Default)**
- No real clicks or messages
- Browser opens briefly for realism
- Actions are logged and persisted to state
- Fully safe and deterministic
- `MODE=simulation`

### **Live Mode**
**Live execution is explicitly blocked by design.**
Error: Live mode is intentionally disabled in this POC

This constraint enforces ethical use and prevents accidental misuse.

## 🕵️ Implemented Stealth Techniques

### ✅ Mandatory Techniques
1. **Human-like Mouse Movement**
   - Overshoot-based cursor targeting
   - Micro-corrections before final hover
   - Variable step counts and speed
   - No straight-line movement
   - *Implemented in:* `src/linkedin/human.js`

2. **Randomized Timing Patterns**
   - Think-time delays before actions
   - Variable interaction pauses
   - Cognitive pauses between decisions
   - *Implemented via `humanDelay()` across pipeline*

3. **Browser Fingerprint Masking (Partial)**
   - Custom user agent
   - Controlled viewport dimensions
   - Non-headless Chromium
   - *Implemented in:* `src/browser/index.js`
   - *Note:* Low-level fingerprint spoofing is intentionally excluded

### ✅ Additional Stealth Techniques
4. **Randomized Scrolling Behavior**
   - Variable scroll distance
   - Multi-step scroll sequences
   - Natural pauses between scrolls

5. **Realistic Typing Simulation**
   - Variable keystroke delays
   - Random typos with backspace correction
   - Human-like typing rhythm

6. **Mouse Hover Simulation**
   - Intentional hover before actions
   - Cursor wandering behavior
   - Element-centric motion patterns

7. **Rate Limiting & Daily Quotas**
   - Connection & message caps
   - State-backed enforcement
   - Cooldown-aware decisions

8. **Security Checkpoint Handling**
   - CAPTCHA / 2FA detection
   - Manual intervention support
   - Execution pause and resume

## ✨ Core Features

### **Authentication & Session Handling**
- Environment-based credentials
- Cookie persistence
- Session restoration
- Graceful login retries

### **Search & Targeting**
- Keyword + location search
- Pagination traversal
- Duplicate profile detection

### **Decision Engine**
- Rule-based, deterministic decisions
- State-aware action eligibility
- Clear separation of logic and execution

### **Action Execution**
- Safety-gated execution layer
- Simulation-only behavior
- Idempotent state updates

### **State Persistence**
- Visited profiles
- Sent invites
- Sent messages
- Daily counters

## 📁 Folder Structure
src/
├── actions/ # Action execution (safety-gated)
├── auth/ # Security checkpoint handling
├── browser/ # Playwright browser setup
├── config/ # Environment-driven config
├── decision/ # Rule-based decision engine
├── linkedin/ # Human behavior + LinkedIn flows
├── logger/ # Structured logging (pino)
├── session/ # Cookie/session persistence
├── state/ # In-memory state & limits
└── index.js # Main orchestrator


## ⚙️ Configuration
Copy `.env.example` to `.env`:
```env
MODE=simulation
LOG_LEVEL=info

LINKEDIN_EMAIL=
LINKEDIN_PASSWORD=
LINKEDIN_AUTH_STRATEGY=session
```
## 📝 Logging

- Structured JSON logs via pino
- Configurable log level
- Contextual metadata on every action
- Fatal crash protection at entrypoint

## 🔒 Safety & Ethics

- Live automation disabled by default and by validation
- No background execution
- No silent retries
- No obfuscation for misuse

This project prioritizes demonstration of engineering patterns over operational capability.

## ⚠️ Disclaimer

This repository is provided strictly for educational and technical evaluation purposes.
Automating LinkedIn or similar platforms may violate their Terms of Service.
Do not use this code on real accounts.

##📄 License
MIT — Educational Use Only
