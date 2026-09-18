\# CONTRACT.md — AI Student Life Mentor



Frozen data shapes for the DynamoDB item and the six API endpoints.

Both Siddu (backend) and Manjunath (frontend) build against this exact shape.

If anything here changes, message the other person immediately with the words "contract change".



\---



\## 1. DynamoDB table



\- Table name: `StudentProfiles`

\- Partition key: `userId` (String) = Cognito `sub`

\- No sort key

\- Billing mode: `PAY\_PER\_REQUEST` (on-demand)



```json

{

&#x20; "userId":      "a1b2c3d4-...",

&#x20; "name":        "Anusha",

&#x20; "klass":       6,

&#x20; "xp":          340,

&#x20; "streak":      3,

&#x20; "lastActive":  "2026-09-19",

&#x20; "badges":      \["first\_quiz", "hydration\_hero", "streak\_3"],

&#x20; "subjects": {

&#x20;   "Mathematics": {

&#x20;     "Fractions":  { "score": 45, "attempts": 2, "lastAttempt": "2026-09-19T10:04:00Z" },

&#x20;     "Geometry":   { "score": 78, "attempts": 1, "lastAttempt": "2026-09-18T18:20:00Z" }

&#x20;   },

&#x20;   "Science": {

&#x20;     "Photosynthesis": { "score": 82, "attempts": 3, "lastAttempt": "2026-09-19T09:10:00Z" }

&#x20;   }

&#x20; },

&#x20; "wellness": { "hydration": 4, "breaks": 2, "activities": 1, "date": "2026-09-19" },

&#x20; "dailyGoals": \[

&#x20;   { "id": "quiz1",  "label": "Complete 1 practice quiz",      "done": true  },

&#x20;   { "id": "water4", "label": "Log 4 glasses of water",        "done": true  },

&#x20;   { "id": "move1",  "label": "One movement break",            "done": false },

&#x20;   { "id": "chat1",  "label": "Ask your mentor a question",    "done": false }

&#x20; ],

&#x20; "createdAt": "2026-09-17T14:00:00Z",

&#x20; "updatedAt": "2026-09-19T10:04:00Z"

}

```



\*\*Derived, never stored:\*\* `weakTopics`. Compute on read/render — every `{subject, topic}` where `score < 60`.



\---



\## 2. API endpoints



| Method \& path | Request body | Response |

|---|---|---|

| `GET /profile` | — | `{ exists: true, profile: {...} }` or `{ exists: false }` |

| `POST /profile` | `{ name, klass }` | `{ profile: {...} }` |

| `POST /chat` | `{ message, history: \[{role, content}] }` | `{ reply: "..." }` |

| `POST /quiz/generate` | `{ subject, topic }` | `{ questions: \[{ id, question, options\[4], answerIndex, explanation }] }` |

| `POST /quiz/submit` | `{ subject, topic, correct, total }` | `{ oldScore, newScore, xpEarned, newBadges\[], profile: {...} }` |

| `POST /wellness` | `{ type: "hydration" \\| "break" \\| "activity" }` | `{ xpEarned, profile: {...} }` |



\*\*Two conventions:\*\*

1\. Every mutating endpoint returns the \*\*entire updated profile\*\* — the frontend never patches or re-fetches, it just replaces its one profile object with what comes back.

2\. Every error is `{ "error": "human readable message" }` with a sensible HTTP status. These strings must be student-safe — never a stack trace.



\---



\## 3. Seed data for a brand-new user



On `POST /profile`, seed a small realistic starting state so the dashboard is never empty and a weak topic is visible immediately.

\- Classes 1–5: Mathematics / English / EVS

\- Classes 6–10: Mathematics / Science / Social Science / English

\- Seed one topic per subject in the 40s so there's a weak topic to fix on camera.



\---



\## 4. Weak-topic rule



Rule-based, not ML. Threshold: \*\*score < 60\*\*.



\---



\## 5. Bedrock model in use



Model ID: `<fill in once confirmed working — see LEARNING.md for the access saga>`

Region: `us-east-1`

