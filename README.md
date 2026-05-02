# VotePath AI 🇮🇳🗳️

## 📖 Project Overview
VotePath AI is a highly optimized, full-stack smart election assistant designed specifically to help Indian voters navigate the electoral process with absolute ease. Whether it's finding polling booths, understanding ID requirements, or gauging public sentiment, VotePath AI provides immediate, localized, AI-driven guidance. By combining an interactive live public poll with a conversational AI agent, VotePath simplifies the traditionally complex voting bureaucracy into an engaging, 3-step digital journey.

## ❗ Problem & Motivation
**The Problem:** Millions of eligible Indian voters—especially first-time voters, senior citizens, and inter-state migrants—often face immense confusion regarding voter registration, polling booth locations, document validity, and candidate platforms. Reading through long, static PDF documents from official Election Commission portals is tedious and often overwhelming.

**Our Solution:** VotePath AI replaces static web pages with an intelligent, dynamic interface. Instead of searching through dense menus, users can simply state their problem to the AI Assistant for an immediate, step-by-step resolution. Furthermore, our live poll feature captures real-time democratic sentiment, making voters feel actively engaged in the electoral process before they even reach the ballot box.

## ✨ Key Features
- **Smart Voter Poll:** A responsive, live polling system that captures public sentiment, validates users securely via mobile number to prevent duplicate votes, and renders state-wise data visualizations using Recharts.
- **AI Election Assistant:** Powered by Google's Gemini 2.5 Flash API, the assistant explains complex electoral processes in simple, conversational language.
- **Scenario-Based Journeys:** Tailored, interactive roadmaps that guide specific user personas (e.g., first-time voter, out-of-state migrant, lost Voter ID) to their exact resolution in seconds.
- **AI Insight Cards:** Immediately upon voting, users receive an AI-generated insight card with personalized recommendations based on their regional selection.
- **Admin Dashboard:** A secure administrative portal to analyze aggregate anonymized feedback and system health.
- **Highly Scalable Backend:** Deployed dynamically on Google Cloud Run with `node-cache` integration to reduce API latency to 0ms for frequent queries.

## 💻 Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS (with complete Glassmorphism & Dark Mode support), Recharts for data visualization, Lucide-React for iconography.
- **Backend:** Node.js, Express, `@google/genai` for LLM routing, `express-rate-limit` for DDoS protection, `xss` for input sanitization.
- **Infrastructure:** Google Cloud Run (Containerized Deployment).
- **Data Persistence:** Mock Firebase SDK / JSON file storage (configured for easy migration to Cloud Firestore).

## 🏗️ Architecture

```text
  [ User Device ] 
        │
   (HTTPS / JSON)
        │
        ▼
[ Frontend (React/Vite) ]  <──► [ Live Poll Charts / AI Chat Interface ]
        │
   (REST API)
        │
        ▼
[ Backend (Node/Express) ] <──► [ In-Memory Cache (node-cache) ]
        │
  (Containerized)
        │
   ┌────┴─────────────────────────────┐
   ▼                                  ▼
[ Google Cloud Run ]           [ Gemini 2.5 API ]
   │                                  │
   ▼                                  ▼
[ Mock Firestore / DB ]        [ Contextual Responses ]
```
**Component Breakdown:**
- **Frontend:** Hosted securely, providing a fast, accessible (WCAG AAA) UI with minimal re-renders using React hooks.
- **Backend:** Handles business logic, limits API abuse via rate-limiting, and securely sanitizes inputs.
- **Cache & LLM:** Checks `node-cache` for identical queries to save costs; if un-cached, securely queries Google Gemini for election data.

## 🚀 Setup Instructions

Clone the repository and set up your environment variables:

```bash
# 1. Clone the repository
git clone https://github.com/VishwajeetCSE/VotePath-AI.git
cd VotePath-AI

# 2. Setup the Backend
cd backend
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
npm install
npm run dev

# 3. Setup the Frontend (in a new terminal)
cd ../frontend
npm install
npm run dev
```

To run using Docker (similar to Cloud Run):
```bash
cd backend
docker build -t votepath-backend .
docker run -p 8080:8080 votepath-backend
```

## ☁️ Deployment Details
VotePath AI is fully deployed on **Google Cloud Run** (`us-central1`). 
- The backend and frontend are containerized dynamically using Google Cloud Buildpacks directly from the source code.
- We utilize Cloud Run's managed HTTPS to ensure all data and voting submissions are transmitted securely.
- Cross-Origin Resource Sharing (CORS) is strictly configured to only accept requests from our verified live domain.

🔗 **Live URL:** [https://votepath-frontend-224296733729.us-central1.run.app/](https://votepath-frontend-224296733729.us-central1.run.app/)

## 📸 Demo
*(Judges: Please visit our live URL to test the interactive features!)*

## 🎥 Demo Reel
Watch here:
https://www.instagram.com/reel/DXyqOQAhYp_/

- **Home Page:** Features our 3-step "How it works" guide and a live aggregate widget.
- **Poll Flow:** Users vote, verify via mobile, and instantly receive an AI Insight Card.
- **Assistant:** Ask any election question and receive formatted, highlighted answers.

## 🛣️ Roadmap / Future Work
- **Multilingual Support:** Integrating native language translation to support Hindi, Marathi, Bengali, and Tamil natively via the AI.
- **Official Integration:** Fetching live data directly from the official Election Commission (ECI) APIs.
- **WhatsApp Bot:** Porting the conversational assistant to a WhatsApp Business number for even greater rural accessibility.
- **Policymaker Analytics:** Expanding the Admin Dashboard to visualize demographic awareness gaps for NGO targeting.

## 📄 Credits & License
- **Developed by:** Vishwajeet
- **License:** MIT License. Free to use, modify, and distribute. We believe democratic technology should be open-source.
