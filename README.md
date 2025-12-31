# LinkedIn Automation (Simulation-Safe)

**Project Overview:**  
This project demonstrates a **simulation-safe LinkedIn automation pipeline**. It evaluates profiles, generates connection messages, and simulates human-like interactions while **avoiding any real account actions**. Ideal for demonstrating automation skills in a safe environment.

---

## Features

- **Profile Evaluation:** Scores profiles based on simulated relevance.
- **Decision Engine:** Determines actions like visit, connect, or message.
- **Human-Like Interaction:** Simulates realistic delays and behavior patterns.
- **Messaging Simulation:** Drafts personalized messages for connections.
- **Session Handling:** Simulated login/session management.
- **Safe Simulation Mode:** Can run without risking actual LinkedIn accounts.

---

## Folder Structure

linkedin-automation/
├── src/
│ ├── action/
│ │ └── index.js
│ ├── auth/
│ │ └── checkpoint.js
│ ├── browser/
│ │ └── index.js
│ ├── config/
│ │ └── index.js
│ ├── decision/
│ │ ├── constant.js
│ │ ├── index.js
│ │ └── rules.js
│ ├── linkedIn/
│ │ ├── connect.js
│ │ ├── human.js
│ │ ├── message.js
│ │ ├── search.js
│ │ ├── profileEvaluation.js
│ │ └── visit.js
│ ├── logger/
│ │ └── index.js
│ ├── messaging/
│ │ └── messageGenerator.js
│ ├── session/
│ │ ├── index.js
│ │ └── cookies/
│ ├── state/
│ │ ├── index.js
│ │ ├── constant.js
│ │ └── storage.js
│ └── index.js
├── storage/
│ ├── session.json
│ └── state.json
├── .env
├── .gitignore
├── package.json
└── README.md

yaml
Copy code

---

## Setup Instructions

1. **Clone the repository**

```bash
git clone <repo-url>
cd linkedin-automation
Install dependencies

bash
Copy code
npm install
Configure environment variables

Create a .env file in the root:

ini
Copy code
LINKEDIN_USERNAME=your_username
LINKEDIN_PASSWORD=your_password
SIMULATION_MODE=true
⚠️ This project runs safely in simulation mode by default.

Run the project

bash
Copy code
npm start
How It Works
Launches a browser in simulation mode.

Loads fake LinkedIn profiles from src/profiles or generates them dynamically.

Runs profile evaluation scoring each profile based on simulated relevance.

Decision engine determines whether to visit, connect, or send a message.

Drafts messages using messaging/messageGenerator.js.

Logs all actions in a structured format using logger.

✅ Everything runs in simulation—no real LinkedIn accounts are impacted.

Demo Output (Simulation)
json
Copy code
[
  {
    "profileUrl": "https://linkedin.com/in/fake-user-3",
    "score": 5,
    "relevance": "MEDIUM_RELEVANCE",
    "message": "Hi there, I came across your profile and thought it would be great to connect."
  },
  {
    "profileUrl": "https://linkedin.com/in/fake-user-1",
    "score": 2,
    "relevance": "LOW_RELEVANCE",
    "message": "Hi there, hope you’re doing well. Sending a quick connection request."
  }
]
Notes for Video Demo
Start with your face on camera, introduce the project purpose.

Switch to screen recording to show simulation logs.

Highlight:

Modular architecture

Human-like interactions

Message drafting

Decision engine flow

End with the simulation output and ranking of profiles.

Future Improvements
Integrate real LinkedIn API safely (with throttling and anti-detection mechanisms).

Enhance decision engine using ML-based profile scoring.

Add logging & analytics dashboards for better insights.

License
MIT License. Educational/demo purposes only.
