const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message.toLowerCase();

  // Replace this with Google Antigravity API
  const reply = generateResponse(userMessage);

  // Add a slight delay to simulate network/AI processing time for the typing animation
  setTimeout(() => {
    res.json({ reply });
  }, 1000);
});

function generateResponse(msg) {
  msg = msg.toLowerCase();

  if (msg.includes("lost") || msg.includes("voter id") || msg.includes("misplaced")) {
    return `No problem — you can recover your voter ID easily 👇\n\nStep 1: Download your digital voter ID (e-EPIC)\nhttps://voterportal.eci.gov.in\n\nStep 2: Apply for duplicate using Form 8\nhttps://www.nvsp.in\n\nStep 3: Track your request\nhttps://www.nvsp.in\n\nTip: Use your registered mobile number for OTP.`;
  }

  if (msg.includes("register") || msg.includes("new voter") || msg.includes("first time") || msg.includes("18")) {
    return `Here’s how to register as a voter 👇\n\nStep 1: Fill Form 6 online\nhttps://www.nvsp.in\n\nStep 2: Upload required documents\nStep 3: Track your application\n\nTip: You must be 18+ to register.`;
  }

  if (msg.includes("shift") || msg.includes("moved") || msg.includes("change address")) {
    return `Moved to a new place? Here is what you need to do 👇\n\nStep 1: Fill Form 8 for shifting constituency\nhttps://www.nvsp.in\n\nStep 2: Upload address proof\n\nTip: You will be issued a new Voter ID card.`;
  }

  if (msg.includes("how to vote") || msg.includes("booth")) {
    return `You can find your polling booth online 👇\n\nStep 1: Search your details\nhttps://electoralsearch.eci.gov.in\n\nTip: On voting day, carry your Voter ID or Aadhaar.`;
  }

  return `I can help you with:\n- Voter registration\n- Lost voter ID\n- Polling booth info\n\nTry asking: "I lost my voter ID"`;
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`VotePath AI Server running on port ${PORT}`));
