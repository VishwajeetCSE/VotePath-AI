const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are VotePath AI, an intelligent, friendly, and helpful Indian election assistant. 
Your goal is to guide users through voting processes like registration, finding polling booths, and correcting details.

Key instructions:
1. Provide actionable help with clear steps.
2. ALWAYS include official URLs when relevant (e.g., https://voters.eci.gov.in, https://electoralsearch.eci.gov.in).
3. Use emojis 😊📄✅ to be friendly.
4. If a user speaks in Hinglish or has typos (e.g., "votar id kho gaya", "mera voter id"), understand their intent and reply politely in a mix of English and Hindi/Hinglish to make them comfortable.
5. If the intent is unclear, ask a clarifying question politely (e.g., "क्या आप नया voter बनाना चाहते हैं या correction करना चाहते हैं? 🤔").
6. Keep responses concise and avoid being robotic.

Common links to include:
- New Registration / Correction: https://voters.eci.gov.in
- Search Electoral Roll / Booth / Download e-EPIC: https://electoralsearch.eci.gov.in
`;

async function getChatResponse(userMessage, history) {
  const contents = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
    { role: "model", parts: [{ text: "Understood. I will act as VotePath AI, following these instructions." }] }
  ];

  for (const msg of history) {
    contents.push({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.text }]
    });
  }

  contents.push({ role: "user", parts: [{ text: userMessage }] });

  // Add Safety Settings for Gemini (Google Services)
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      temperature: 0.7,
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    }
  });

  return response.text;
}

module.exports = { getChatResponse };
