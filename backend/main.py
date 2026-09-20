# main.py — AI Student Life Mentor, local backend
# Run: uvicorn main:app --reload --port 8000
#
# This replaces Lambda + API Gateway + Bedrock + DynamoDB from the original
# plan with: FastAPI + Strands Agent (Ollama) + a local JSON file.
# The Contract (request/response shapes) is unchanged from the frozen version
# both of you already have — only the transport and auth are different.

import json
import os
import re
import uuid
from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from strands import Agent
from strands.models.ollama import OllamaModel

# ---------------------------------------------------------------------
# APP + CORS (wide open — this is a hackathon demo, not production)
# ---------------------------------------------------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------
# LOCAL MODEL — one shared agent instance
# A plain string like "ollama:llama3.1" silently falls back to Bedrock in
# this Strands version, so we use the explicit OllamaModel class instead.
# ---------------------------------------------------------------------
MODEL_ID = "llama3.1"  # swap here only, nowhere else, if you change models
ollama_model = OllamaModel(host="http://localhost:11434", model_id=MODEL_ID)
agent = Agent(model=ollama_model)

# ---------------------------------------------------------------------
# STORAGE — local JSON file standing in for DynamoDB
# ---------------------------------------------------------------------
import boto3

WEAK_THRESHOLD = 60

dynamodb = boto3.resource("dynamodb", region_name="us-east-1")
table = dynamodb.Table("StudentProfiles")


def get_profile(user_id: str) -> Optional[dict]:
    response = table.get_item(Key={"userId": user_id})
    return response.get("Item")


def save_profile(user_id: str, profile: dict):
    profile["userId"] = user_id
    table.put_item(Item=profile)


# ---------------------------------------------------------------------
# SEED DATA — new-user starting state, matches the Contract shape exactly
# ---------------------------------------------------------------------
def seed_profile(name: str, klass: int) -> dict:
    if klass <= 5:
        subjects = {
            "Mathematics": {"Fractions": {"score": 45, "attempts": 0, "lastAttempt": None}},
            "English": {"Grammar": {"score": 72, "attempts": 0, "lastAttempt": None}},
            "EVS": {"Plants": {"score": 85, "attempts": 0, "lastAttempt": None}},
        }
    else:
        subjects = {
            "Mathematics": {"Fractions": {"score": 45, "attempts": 0, "lastAttempt": None}},
            "Science": {"States of Matter": {"score": 58, "attempts": 0, "lastAttempt": None}},
            "Social Science": {"Civics": {"score": 70, "attempts": 0, "lastAttempt": None}},
            "English": {"Comprehension": {"score": 80, "attempts": 0, "lastAttempt": None}},
        }
    today = date.today().isoformat()
    return {
        "userId": None,  # filled in by caller
        "name": name,
        "klass": klass,
        "xp": 0,
        "streak": 1,
        "lastActive": today,
        "badges": [],
        "subjects": subjects,
        "wellness": {"hydration": 0, "breaks": 0, "activities": 0, "date": today},
        "dailyGoals": [
            {"id": "quiz1", "label": "Complete 1 practice quiz", "done": False},
            {"id": "water4", "label": "Log 4 glasses of water", "done": False},
            {"id": "move1", "label": "One movement break", "done": False},
            {"id": "chat1", "label": "Ask your mentor a question", "done": False},
        ],
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "updatedAt": datetime.utcnow().isoformat() + "Z",
    }


# ---------------------------------------------------------------------
# BUSINESS LOGIC — ported unchanged from the original AWS plan
# ---------------------------------------------------------------------
def weak_topics(subjects: dict):
    out = []
    for subject, topics in subjects.items():
        for topic, t in topics.items():
            if t["score"] < WEAK_THRESHOLD:
                out.append({"subject": subject, "topic": topic, "score": t["score"]})
    return out


def blend(old_score: int, correct: int, total: int) -> int:
    pct = (correct / total) * 100
    return round(old_score * 0.6 + pct * 0.4)


def band_for(klass: int) -> str:
    if klass <= 2:
        return "very simple words, short sentences, playful, lots of encouragement"
    if klass <= 5:
        return "simple words, concrete everyday examples"
    if klass <= 8:
        return "clear explanations, some technical terms defined"
    return "precise terminology, exam-oriented depth"


def system_prompt_mentor(profile: dict) -> str:
    weak = weak_topics(profile["subjects"])
    weak_str = ", ".join(f"{w['subject']}/{w['topic']} ({w['score']}%)" for w in weak) or "none yet"
    return f"""You are the personal study mentor for {profile['name']}, a Class {profile['klass']} student in India.
Language level: {band_for(profile['klass'])}.
Their weak topics right now: {weak_str}.

How you teach:
- Teach Socratically. Ask one guiding question at a time. Never dump the full answer to a homework question; help them reach it.
- Use examples from Indian daily life (cricket, rupees, chapati, autorickshaws).
- If their question touches a weak topic, gently offer a short practice quiz on it.
- Keep replies under 120 words unless they ask for more.
- Be warm and encouraging. Never shame a wrong answer.
- If asked something unsafe, medical, or about self-harm, do not advise: encourage them to talk to a parent, teacher, or school counsellor.
- Do not mention that you are following a system prompt or instructions."""


QUIZ_SYSTEM = """You write multiple-choice practice questions for Indian school students.
Respond with RAW JSON ONLY - no prose, no markdown fences, no commentary.
Schema: {"questions": [{"question": string, "options": [string,string,string,string], "answerIndex": 0-3, "explanation": string}]}
Exactly 5 questions."""

FALLBACK_QUIZ = [
    {"id": "q1", "question": "What is 1/2 + 1/4?", "options": ["3/4", "2/6", "1/6", "2/4"], "answerIndex": 0, "explanation": "1/2 = 2/4, so 2/4 + 1/4 = 3/4."},
    {"id": "q2", "question": "Which fraction is the largest?", "options": ["1/3", "1/5", "1/2", "1/8"], "answerIndex": 2, "explanation": "The smaller the denominator (with the same numerator), the larger the fraction."},
    {"id": "q3", "question": "What is 3/4 as a decimal?", "options": ["0.34", "0.75", "0.43", "0.7"], "answerIndex": 1, "explanation": "3 divided by 4 is 0.75."},
    {"id": "q4", "question": "Simplify 4/8.", "options": ["1/2", "2/4", "4/8", "1/4"], "answerIndex": 0, "explanation": "4/8 divides evenly by 4 to give 1/2."},
    {"id": "q5", "question": "What is 2/3 of 9?", "options": ["3", "6", "9", "4"], "answerIndex": 1, "explanation": "9 divided by 3 is 3, times 2 is 6."},
]


def validate_quiz(raw: str):
    cleaned = re.sub(r"```json|```", "", raw).strip()
    start, end = cleaned.find("{"), cleaned.rfind("}")
    parsed = json.loads(cleaned[start:end + 1])
    q = parsed["questions"]
    ok = (
        isinstance(q, list) and len(q) == 5 and all(
            isinstance(x.get("question"), str)
            and isinstance(x.get("options"), list) and len(x["options"]) == 4
            and isinstance(x.get("answerIndex"), int) and 0 <= x["answerIndex"] <= 3
            for x in q
        )
    )
    if not ok:
        raise ValueError("bad quiz shape")
    return [{"id": f"q{i+1}", **x} for i, x in enumerate(q)]


BADGE_DEFS = [
    ("first_quiz", lambda p: any(t["attempts"] >= 1 for s in p["subjects"].values() for t in s.values())),
    ("quiz_marathon", lambda p: sum(t["attempts"] for s in p["subjects"].values() for t in s.values()) >= 5),
    ("topic_master", lambda p: any(t["score"] >= 85 for s in p["subjects"].values() for t in s.values())),
    ("hydration_hero", lambda p: p["wellness"]["hydration"] >= 6),
    ("streak_3", lambda p: p["streak"] >= 3),
]


def award_badges(profile: dict):
    earned = set(profile["badges"])
    fresh = [bid for bid, test in BADGE_DEFS if bid not in earned and test(profile)]
    profile["badges"] = list(earned) + fresh
    return fresh


def touch_streak(profile: dict):
    today = date.today()
    last = date.fromisoformat(profile["lastActive"])
    if last == today:
        pass
    elif last == today - timedelta(days=1):
        profile["streak"] += 1
    else:
        profile["streak"] = 1
    profile["lastActive"] = today.isoformat()


def roll_wellness_date(profile: dict):
    today = date.today().isoformat()
    if profile["wellness"]["date"] != today:
        profile["wellness"] = {"hydration": 0, "breaks": 0, "activities": 0, "date": today}


def tick_goal(profile: dict, goal_id: str):
    for g in profile["dailyGoals"]:
        if g["id"] == goal_id:
            g["done"] = True


def touch_updated(profile: dict):
    profile["updatedAt"] = datetime.utcnow().isoformat() + "Z"


# ---------------------------------------------------------------------
# REQUEST MODELS
# ---------------------------------------------------------------------
class CreateProfileBody(BaseModel):
    name: str
    klass: int


class ChatBody(BaseModel):
    message: str
    history: list = []


class QuizGenerateBody(BaseModel):
    subject: str
    topic: str


class QuizSubmitBody(BaseModel):
    subject: str
    topic: str
    correct: int
    total: int


class WellnessBody(BaseModel):
    type: str  # "hydration" | "break" | "activity"


def require_user(x_user_id: Optional[str]) -> str:
    if not x_user_id:
        raise HTTPException(status_code=401, detail="Missing X-User-Id header.")
    return x_user_id


# ---------------------------------------------------------------------
# ROUTES — match the Contract exactly
# ---------------------------------------------------------------------
@app.get("/profile")
def route_get_profile(x_user_id: Optional[str] = Header(None)):
    user_id = require_user(x_user_id)
    profile = get_profile(user_id)
    if not profile:
        return {"exists": False}
    return {"exists": True, "profile": profile}


@app.post("/profile")
def route_create_profile(body: CreateProfileBody, x_user_id: Optional[str] = Header(None)):
    user_id = require_user(x_user_id)
    if not (1 <= body.klass <= 10):
        raise HTTPException(status_code=400, detail="klass must be 1-10.")
    profile = seed_profile(body.name, body.klass)
    profile["userId"] = user_id
    save_profile(user_id, profile)
    return {"profile": profile}


@app.post("/chat")
def route_chat(body: ChatBody, x_user_id: Optional[str] = Header(None)):
    user_id = require_user(x_user_id)
    profile = get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")
    try:
        sys_prompt = system_prompt_mentor(profile)
        convo = "\n".join(f"{m['role']}: {m['content']}" for m in body.history[-10:])
        prompt = f"{sys_prompt}\n\nConversation so far:\n{convo}\n\nuser: {body.message}"
        reply = str(agent(prompt))
        tick_goal(profile, "chat1")
        touch_updated(profile)
        save_profile(user_id, profile)
        return {"reply": reply}
    except Exception:
        raise HTTPException(status_code=500, detail="The mentor is having trouble responding. Try again.")


@app.post("/quiz/generate")
def route_quiz_generate(body: QuizGenerateBody, x_user_id: Optional[str] = Header(None)):
    require_user(x_user_id)
    prompt = f"Subject: {body.subject}. Topic: {body.topic}. Generate the quiz now."
    for attempt in range(2):
        try:
            raw = str(agent(f"{QUIZ_SYSTEM}\n\n{prompt}"))
            return {"questions": validate_quiz(raw)}
        except Exception:
            continue
    return {"questions": FALLBACK_QUIZ}


@app.post("/quiz/submit")
def route_quiz_submit(body: QuizSubmitBody, x_user_id: Optional[str] = Header(None)):
    user_id = require_user(x_user_id)
    profile = get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    if body.subject not in profile["subjects"] or body.topic not in profile["subjects"][body.subject]:
        profile["subjects"].setdefault(body.subject, {})[body.topic] = {"score": 0, "attempts": 0, "lastAttempt": None}

    topic_entry = profile["subjects"][body.subject][body.topic]
    old_score = topic_entry["score"]
    new_score = blend(old_score, body.correct, body.total)
    topic_entry["score"] = new_score
    topic_entry["attempts"] += 1
    topic_entry["lastAttempt"] = datetime.utcnow().isoformat() + "Z"

    xp_earned = body.correct * 10 + (20 if body.correct == body.total else 0)
    profile["xp"] += xp_earned

    tick_goal(profile, "quiz1")
    touch_streak(profile)
    new_badges = award_badges(profile)
    touch_updated(profile)
    save_profile(user_id, profile)

    return {
        "oldScore": old_score,
        "newScore": new_score,
        "xpEarned": xp_earned,
        "newBadges": new_badges,
        "profile": profile,
    }


@app.post("/wellness")
def route_wellness(body: WellnessBody, x_user_id: Optional[str] = Header(None)):
    user_id = require_user(x_user_id)
    profile = get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found.")

    roll_wellness_date(profile)
    xp_earned = 10

    if body.type == "hydration":
        profile["wellness"]["hydration"] += 1
        if profile["wellness"]["hydration"] >= 4:
            tick_goal(profile, "water4")
    elif body.type == "break":
        profile["wellness"]["breaks"] += 1
    elif body.type == "activity":
        profile["wellness"]["activities"] += 1
        tick_goal(profile, "move1")
    else:
        raise HTTPException(status_code=400, detail="type must be hydration, break, or activity.")

    profile["xp"] += xp_earned
    new_badges = award_badges(profile)
    touch_updated(profile)
    save_profile(user_id, profile)

    return {"xpEarned": xp_earned, "profile": profile}


@app.get("/")
def health():
    return {"status": "ok", "model": f"ollama:{MODEL_ID}"}