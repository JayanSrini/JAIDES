import os
from typing import Literal

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI(title="JAIDES LLC API")

frontend_origins = os.getenv(
    "FRONTEND_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)
allowed_origins = [origin.strip() for origin in frontend_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AppointmentRequest(BaseModel):
    name: str
    email: EmailStr
    interest: Literal["Real Estate", "Angel Investing", "Partnership Inquiry", "General Introduction"]
    preferred_date: str
    preferred_time: str
    notes: str


COMPANY_PROFILE = {
    "company": {
        "name": "JAIDES LLC",
        "tagline": "Real estate stewardship and angel investment with a long-view mindset.",
        "summary": (
            "JAIDES LLC is presented here as a boutique family-led firm focused on"
            " thoughtful property investment, strategic capital partnerships, and"
            " trusted relationship-driven growth."
        ),
        "mission": (
            "Operate with patience, clarity, and disciplined stewardship across both"
            " property and private capital decisions."
        ),
    },
    "highlights": [
        {
            "title": "Real Estate",
            "description": "Acquisition and oversight of residential and mixed-use opportunities with a focus on durable value.",
        },
        {
            "title": "Angel Investing",
            "description": "Selective early-stage backing for founders building resilient, practical businesses.",
        },
        {
            "title": "Family Office Style",
            "description": "A calm, disciplined approach centered on stewardship, trust, and long-term alignment.",
        },
    ],
    "services": [
        {
            "title": "Property Strategy",
            "description": "Thoughtful evaluation of opportunities, hold strategies, and portfolio fit.",
        },
        {
            "title": "Capital Partnerships",
            "description": "Relationship-driven conversations with founders, operators, and aligned partners.",
        },
        {
            "title": "Long-Term Advisory Lens",
            "description": "Measured judgment rooted in risk awareness, timing discipline, and trust.",
        },
    ],
    "stats": [
        {"label": "Decision style", "value": "Patient + Disciplined"},
        {"label": "Primary sectors", "value": "Property + Early Stage"},
        {"label": "Operating posture", "value": "Selective + Relationship-Led"},
    ],
    "timeline": [
        {
            "year": "Vision",
            "title": "Define the family office mindset",
            "description": "Create a clear point of view around stewardship, quality opportunities, and long-range conviction.",
        },
        {
            "year": "Growth",
            "title": "Build aligned relationships",
            "description": "Cultivate trusted conversations with operators, founders, and strategic collaborators.",
        },
        {
            "year": "Scale",
            "title": "Expand with discipline",
            "description": "Pursue opportunities that fit the firm's values, pace, and appetite for durable value creation.",
        },
    ],
    "appointment_options": {
        "topics": [
            "Real Estate",
            "Angel Investing",
            "Partnership Inquiry",
            "General Introduction",
        ],
        "times": ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"],
    },
    "founders": [
        {
            "name": "Srinivasan Santhanam",
            "role": "Co-Founder",
            "bio": "Placeholder biography copy for site development. Srinivasan is described as bringing measured judgment, operational discipline, and a relationship-first perspective to both property decisions and early-stage investing.",
            "focus": "Investment discipline, relationship building, and steady long-range decision-making.",
        },
        {
            "name": "Deepa Lakshmanan",
            "role": "Co-Founder",
            "bio": "Placeholder biography copy for site development. Deepa is described as combining thoughtful strategy, aesthetic sensibility, and a people-centered approach that helps shape the firm's partnerships and long-term vision.",
            "focus": "Brand direction, strategic vision, and a detail-oriented perspective on partnership quality.",
        },
    ],
}

APPOINTMENT_REQUESTS: list[AppointmentRequest] = []


@app.get("/")
def root() -> dict:
    return {"service": "JAIDES LLC API", "status": "online"}


@app.get("/api/profile")
def get_profile() -> dict:
    return COMPANY_PROFILE


@app.post("/api/appointments")
def create_appointment(request: AppointmentRequest) -> dict:
    APPOINTMENT_REQUESTS.append(request)
    return {
        "status": "received",
        "message": f"Thanks, {request.name}. Your appointment request has been saved for review.",
    }


@app.get("/api/health")
def healthcheck() -> dict:
    return {"status": "ok"}
