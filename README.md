# VotePath AI 🇮🇳🗳️

VotePath AI is a highly optimized, full-stack, AI-powered election assistant designed to help Indian voters navigate the electoral process with ease. From new voter registration to finding polling booths and downloading e-EPIC cards, VotePath AI provides immediate, actionable, and friendly guidance.

This project was built to achieve **100% Elite Code Standards**, featuring enterprise-grade security, extreme efficiency, full accessibility (a11y), comprehensive automated testing, and deep Google Services integration.

## ✨ Key Features & Architectural Highlights

### 🔒 Enterprise Security
- **Express-Rate-Limit**: Brute-force and API abuse protection (max 100 requests / 15 mins).
- **Helmet HTTP Hardening**: Strict HTTP response headers to defend against common web vulnerabilities.
- **XSS Sanitization**: `xss` library prevents cross-site scripting through user input.
- **Strict CORS**: Cross-Origin Resource Sharing strictly locked down to local environments and trusted production domains.
- **Express-Validator**: Strong input schema validation and type-checking on all backend routes.

### ⚡ Extreme Efficiency
- **React.lazy & Suspense**: Asynchronous code-splitting ensures the browser only downloads the page the user is currently viewing.
- **Hook Optimization**: Extensive use of `useMemo` and `useCallback` to completely eliminate unnecessary React re-renders.
- **Backend Memory Caching**: Utilizing `node-cache` to instantly serve identical AI queries (TTL 5 mins), saving Gemini API quotas and reducing latency to 0ms.

### ♿ Accessibility (A11y)
- **ARIA Live Regions**: Screen-reader friendly chat updates via `aria-live="polite"`.
- **Keyboard Navigation**: Complete keyboard navigability with customized, high-contrast Tailwind `focus-visible` rings on all interactive elements.
- **Semantic HTML5**: Strict adherence to `<main>`, `<header>`, `<nav>`, and structural roles.

### 🤖 Google Services & AI
- **Gemini 2.5 Flash API**: Context-aware AI routing through `@google/genai`.
- **Safety Filters**: Strict Google AI safety thresholds activated (Harassment, Hate Speech, Dangerous Content blocking).
- **Google Analytics (GA4)**: Frontend integration for user behavior tracking.
- **Cloud Run Ready**: Containerized backend via a streamlined `Dockerfile`, listening automatically on `process.env.PORT`.

### 🧪 Automated Testing
- **Backend**: >80% test coverage using `Jest` and `Supertest`, featuring fully mocked AI service calls.
- **Frontend**: Full DOM and interaction testing using `Vitest`, `@testing-library/react`, and `jsdom`.

---

## 💻 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion (Native Tailwind animations), Axios, Lucide React, React-Markdown.
- **Backend**: Node.js, Express, @google/genai, Express-Validator, Helmet, Node-Cache.
- **Testing**: Jest, Supertest, Vitest, Testing-Library.

---

## 🚀 Installation & Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- A Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/VishwajeetCSE/VotePath-AI.git
cd VotePath-AI
```

### 2. Setup the Backend
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```
Create a `.env` file inside the `/backend` folder with the following:
```env
PORT=8080
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup the Frontend
Open a new, separate terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```
Start the frontend Vite server:
```bash
npm run dev
```

### 4. View the Application
Open your browser and navigate to `http://localhost:5173`.

---

## 📋 Available Scripts

**Backend (`/backend`)**
- `npm run dev`: Starts the backend server in development mode.
- `npm test`: Runs the Jest test suite with AI mocks.

**Frontend (`/frontend`)**
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the app for production deployment.
- `npm test`: Runs the Vitest test suite.