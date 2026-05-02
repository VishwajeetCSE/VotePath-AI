const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const chatRoutes = require("./routes/chat");

const app = express();

// Security: HTTP Headers
app.use(helmet());

// Security: CORS Restrictions
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:3000', 
  'https://votepath-frontend-224296733729.us-central1.run.app',
  process.env.FRONTEND_URL
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// Security: Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use('/chat', limiter);

// Routes
app.use("/chat", chatRoutes);
app.use("/api/polls", require("./routes/pollRoutes"));
app.use("/api/feedback", require("./routes/feedbackRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

// Health check
app.get("/", (req, res) => {
  res.send("VotePath AI Backend is running successfully!");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({ reply: "Oops! My brain is a bit fuzzy right now. Please try again later. 😅" });
});

const PORT = process.env.PORT || 8080;
if (require.main === module) {
  app.listen(PORT, () => console.log(`VotePath AI Server running on port ${PORT}`));
}

module.exports = app;
