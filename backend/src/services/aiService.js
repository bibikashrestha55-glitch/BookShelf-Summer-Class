const { Groq } = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const resolveModel = () => {
  return process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
};

const callGroq = async ({ system, user, jsonMode = true }) => {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error("GROQ_API_KEY is missing");
    error.code = "MISSING_GROQ_API_KEY";
    throw error;
  }

  const payload = {
    model: resolveModel(),
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.7,
    max_tokens: 500,
    response_format: jsonMode ? { type: "json_object" } : undefined,
  };

  const completion = await groq.chat.completions.create(payload);

  return completion.choices?.[0]?.message?.content || "";
};

module.exports = {
  callGroq,
  resolveModel,
};
