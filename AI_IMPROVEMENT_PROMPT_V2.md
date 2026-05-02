# Role & Goal
You are an Elite Full-Stack Developer and AI Evaluation Expert. I am currently at a 90.81% score in my AI-judged coding challenge, ranking at 463. I need to reach the TOP 100 (sub-100 rank) and achieve a 100% score. 

To get these final points, we must add complex, high-quality, and interactive features while flawlessly maintaining Code Quality, Security, Efficiency, Testing, Accessibility, and Google Services integration.

# Feature Requirements
Please implement the following full-stack features into my `VotePath AI` Express/React application. Provide all the necessary code (frontend components, backend routes, database models, etc.) and terminal commands.

## 1. Advanced Interactive Features
- **Feedback & Rating System**: Create a vibrant UI section where users can submit a star rating and text feedback.
- **Political Party & Politician Polling**: Create a secure polling system.
  - A poll for users to vote for their preferred political parties.
  - A ranking leaderboard for famous politicians based on genuine user votes.
- **Election Dashboard**: Create a colorful, resource-rich information page displaying:
  - The current ruling party vs. opposition parties, including background details.
  - Live/Upcoming elections and detailed candidate profiles.
  - Educational content on how the election process works, complete with relevant placeholder images and resources.

## 2. Fulfillment of AI Grading Criteria (Crucial for 100% Score)
While building the above features, you MUST strictly adhere to the following grading criteria:

- **Security (Genuine Users)**: To ensure votes and feedback are from "genuine users", integrate strict backend input validation (`express-validator`), rate limiting, and implement **Google reCAPTCHA v3** (Boosts Google Services and Security scores). Prevent duplicate voting using IP tracking or session cookies.
- **Google Services**: Use **Firebase/Firestore** (or a mock service structured like Firebase) to store the polling data, feedback, and candidate details, OR integrate Google Custom Search / Maps for candidate regions.
- **Accessibility (a11y) & UI**: The new pages MUST be highly colorful, engaging, and modern. However, you must enforce WCAG AAA color contrast, use semantic HTML (`<section>`, `<article>`), and ensure every new chart, image, and poll button has precise `aria-labels` and keyboard navigability.
- **Efficiency**: Implement data caching on the backend for the polling results and election data so the dashboard loads instantly. Use React `useMemo` for charting/ranking calculations and `React.lazy()` for the new routes.
- **Testing**: Provide Jest/Supertest coverage for the new `/api/polls` and `/api/feedback` routes. Provide Vitest/React Testing Library coverage for the new `Dashboard.jsx` and `Poll.jsx` components.
- **Code Quality**: Maintain absolute modularity. Create separate `controllers/pollController.js`, `routes/pollRoutes.js`, and dedicated React components (`PollCard.jsx`, `CandidateList.jsx`).

# Deliverables
1. **Terminal Commands**: For any new dependencies (e.g., `firebase`, `react-google-recaptcha-v3`, charting libraries).
2. **Backend Code**: The new routes, controllers, and validation logic.
3. **Frontend Code**: The vibrant new React pages and components, meticulously styled with Tailwind CSS.
4. **Testing Code**: The exact test files required to maintain high coverage.

Please write the complete code for these additions!
