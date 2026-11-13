import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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

COMPANY_PROFILE = {
    "company": {
        "name": "JAIDES LLC",
        "tagline": "We invest in property and promising technology companies.",
        "summary": (
            "JAIDES LLC is a family-run investment company. We look for solid real"
            " estate and early-stage software and AI businesses solving real problems."
        ),
        "mission": (
            "We invest patiently and work directly with founders when our experience"
            " can help."
        ),
        "email": "jayansrini@jaides.com",
    },
    "highlights": [
        {
            "title": "Real Estate",
            "description": "Residential and mixed-use properties with sound fundamentals and a clear plan for long-term ownership.",
        },
        {
            "title": "Technology Companies",
            "description": "Early-stage software and technology companies with a useful product, capable founders, and a realistic path to customers.",
        },
        {
            "title": "Practical AI",
            "description": "AI companies that make work easier, improve decisions, or solve a specific business problem.",
        },
    ],
    "services": [
        {
            "title": "Early-Stage Capital",
            "description": "We invest selectively and prefer companies with a clear product, a real customer need, and founders who know their market.",
        },
        {
            "title": "Founder Guidance",
            "description": "We can help think through enterprise sales, partnerships, operations, hiring, and the practical work of growing a company.",
        },
        {
            "title": "Real Estate",
            "description": "We also consider property opportunities where patient ownership and careful management can make a difference.",
        },
    ],
    "stats": [
        {"label": "Investment style", "value": "Long-term"},
        {"label": "Company focus", "value": "Technology + AI"},
        {"label": "How we help", "value": "Capital + guidance"},
    ],
    "timeline": [
        {
            "year": "Learn",
            "title": "Understand the product",
            "description": "We start with the problem, the customer, and why the team is well suited to solve it.",
        },
        {
            "year": "Invest",
            "title": "Back a clear plan",
            "description": "We look for a sensible use of capital and a path to building a durable business.",
        },
        {
            "year": "Help",
            "title": "Stay useful after the check",
            "description": "When useful, we offer practical guidance, introductions, and an experienced outside perspective.",
        },
    ],
    "appointment_options": {
        "topics": [
            "Real Estate",
            "Technology / AI",
            "Partnership Inquiry",
            "General Introduction",
        ],
        "times": ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"],
    },
    "founders": [
        {
            "name": "Srinivasan Santhanam",
            "role": "Co-Founder",
            "bio": "Srinivasan has led global business transformation and enterprise technology work. At JAIDES, he helps evaluate products, enterprise sales opportunities, and what it will take for a company to scale.",
            "focus": "Enterprise technology, business transformation, and growth strategy.",
            "linkedin": "https://www.linkedin.com/in/srini-santhanam-7737556/",
        },
        {
            "name": "Deepa Lakshmanan",
            "role": "Co-Founder",
            "bio": "Deepa brings more than 15 years of experience across human resources, operations, contracts, and finance. She helps founders think through hiring, leadership, team structure, and day-to-day operations.",
            "focus": "People, hiring, operations, and organizational development.",
            "linkedin": "https://www.linkedin.com/in/deepa-lakshmanan-10071243/",
        },
    ],
}

@app.get("/")
def root() -> dict:
    return {"service": "JAIDES LLC API", "status": "online"}


@app.get("/api/profile")
def get_profile() -> dict:
    return COMPANY_PROFILE

@app.get("/api/health")
def healthcheck() -> dict:
    return {"status": "ok"}
