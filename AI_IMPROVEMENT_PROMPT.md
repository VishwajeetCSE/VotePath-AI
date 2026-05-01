# Role & Goal
You are an Elite Full-Stack Developer and Code Evaluator. I am participating in a coding challenge where my codebase is evaluated by an AI judge based on 6 criteria: Code Quality, Security, Efficiency, Testing, Accessibility, and Google Services. My current score is 59.33%.

Your mission is to write the exact code and terminal commands needed to upgrade my Express/React application ("VotePath AI") so that it achieves a 100% score and ranks under 50. 

# Target Codebase Overview
- **Backend**: Express, `@google/genai` (Gemini API), `xss`.
- **Frontend**: React, Vite, Tailwind CSS, `axios`, `lucide-react`.

# Strict Requirements (100% Fulfillment)
You MUST implement the following changes and provide the full code for any modified files.

## 1. Code Quality
- **Modularization**: Refactor `backend/server.js` by moving the Gemini API logic into a separate `services/aiService.js` and the routes into a `routes/chat.js` controller.
- **Global Error Handling**: Implement a robust global error-handling middleware in Express to catch all unhandled exceptions cleanly.
- **Frontend PropTypes**: Add `prop-types` validation to all React components (e.g., `Assistant.jsx`, `Navbar.jsx`) to ensure clean prop passing.
- **Linting Fixes**: Ensure no unused variables or messy imports exist.

## 2. Security
- **HTTP Headers**: Install and configure `helmet` in the backend to secure HTTP headers.
- **Rate Limiting**: Install and configure `express-rate-limit` to prevent brute-force attacks and abuse of the `/chat` endpoint.
- **CORS Hardening**: Restrict `cors()` in `server.js` to only allow specific origins (e.g., standard frontend ports or production URLs) instead of wildcard `*`.
- **Input Validation**: Add `express-validator` to strictly type-check and validate the schema of incoming request bodies before processing them.

## 3. Efficiency
- **React Optimization**: Refactor `frontend/src/pages/Assistant.jsx` by wrapping functions in `useCallback` and static structures in `useMemo` to prevent unnecessary re-renders.
- **Code Splitting (Lazy Loading)**: Modify `App.jsx` to use `React.lazy()` and `Suspense` for loading page components asynchronously.
- **Backend Caching**: Implement `node-cache` in the backend to cache identical user queries and responses for at least 5 minutes.

## 4. Testing
- **Backend Test Coverage**: Expand `backend/server.test.js` using `jest` and `supertest` to achieve >80% coverage. Mock the Gemini API call so tests run without hitting the real API. Add `"test": "jest"` to backend `package.json`.
- **Frontend Test Suite**: Install `vitest` and `@testing-library/react`. Configure them in `vite.config.js`. Write an `Assistant.test.jsx` file testing basic DOM rendering, chat input state, and accessibility roles. Add `"test": "vitest"` to frontend `package.json`.

## 5. Accessibility (a11y)
- **ARIA Enhancements**: Add comprehensive `aria-labels`, `aria-live="polite"`, and correct `role` attributes throughout `Assistant.jsx` and other UI components.
- **Keyboard Navigation**: Ensure all custom buttons, inputs, and interactive elements have a clear visual focus indicator (using Tailwind's `focus:ring` or `focus-visible`) and proper `tabIndex`.
- **Semantic HTML**: Ensure the structure strictly uses `<main>`, `<nav>`, `<header>`, and `<footer>` elements where appropriate.

## 6. Google Services
- **Gemini API Safety**: Add explicit `safetySettings` (e.g., Harassment, Hate Speech filters) to the `generateContent` configuration in the backend.
- **Google Analytics (GA4)**: Provide the code to integrate a Google Analytics script into the frontend's `index.html` or a dedicated React hook.
- **Google Cloud Run Ready**: Ensure `server.js` listens precisely to `process.env.PORT` and provide a clean `Dockerfile` setup confirmation for seamless GCP deployment.

Please output the necessary terminal commands to install new dependencies, followed by the complete, updated code for each required file.
