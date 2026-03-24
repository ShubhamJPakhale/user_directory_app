const express = require("express");
const cors = require("cors");
require("dotenv").config();
const OpenAI = require("openai");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

const requestCache = new Map();

const groqClient = new OpenAI({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const isRateLimited = (userId) => {
  const now = Date.now();
  const lastRequest = requestCache.get(userId);

  if (lastRequest && now - lastRequest < 2000) {
    return true;
  }

  requestCache.set(userId, now);
  return false;
};

// Helper function for retry logic
const fetchWithRetry = async (url, options, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status === 429 && i < retries - 1) {
          const waitTime = Math.pow(2, i) * 1000;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }

        const errorText = await response.text();
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      return response;
    } catch (error) {
      if (i === retries - 1) throw error;

      const waitTime = Math.pow(2, i) * 1000;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
};

// OpenAI API Route
app.post("/api/generate-openai-insight", async (req, res) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({ error: "User data is required" });
    }

    if (isRateLimited(`openai_${user.id}`)) {
      return res.status(429).json({
        error: "Too many requests. Please wait before trying again.",
      });
    }

    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "OpenAI API key not configured" });
    }

    const prompt = `
    Summarize the following user in 1–2 sentences:
    Name: ${user.name}
    Role: ${user.role}
    Status: ${user.status}
    Language: ${user.language}
`;

    const response = await fetchWithRetry(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
          max_tokens: 60,
        }),
      },
    );

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      res.json({
        insight: data.choices[0].message.content.trim(),
      });
    } else {
      res.status(500).json({ error: "Failed to generate insight" });
    }
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate OpenAI insight",
    });
  }
});

// Anthropic API Route
app.post("/api/generate-anthropic-insight", async (req, res) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({ error: "User data is required" });
    }

    // Check rate limit
    if (isRateLimited(`anthropic_${user.id}`)) {
      return res.status(429).json({
        error: "Too many requests. Please wait before trying again.",
      });
    }

    const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "Anthropic API key not configured" });
    }

    // Verify API key format
    if (!apiKey.startsWith("sk-ant-")) {
      console.error("Invalid Anthropic API key format");
      return res
        .status(500)
        .json({ error: "Invalid Anthropic API key format" });
    }

    const prompt = `Summarize the following user in 1-2 sentences:
Name: ${user.name}
Role: ${user.role}
Status: ${user.status}
Language: ${user.language}`;

    const requestBody = {
      model: "claude-3-haiku-20240307",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    console.log("Sending request to Anthropic API");

    const response = await fetchWithRetry(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(requestBody),
      },
    );

    const data = await response.json();
    console.log("Anthropic API Response:", JSON.stringify(data, null, 2));

    if (data.content && data.content[0] && data.content[0].text) {
      console.log("Successfully extracted insight from Anthropic response");
      const insight = data.content[0].text.trim();
      res.json({ insight });
    } else if (data.error) {
      console.error("Anthropic API returned error:", data.error);
      res
        .status(500)
        .json({ error: data.error.message || "Failed to generate insight" });
    } else {
      console.error("Unexpected Anthropic response structure:", data);
      res.status(500).json({
        error: "Unexpected response from Anthropic API",
        details: data,
      });
    }
  } catch (error) {
    console.error("Anthropic Error Details:", {
      message: error.message,
      type: error.name,
    });
    res.status(500).json({
      error: error.message || "Failed to generate Anthropic insight",
    });
  }
});

// Groq API Route
app.post("/api/generate-groq-insight", async (req, res) => {
  try {
    const { user } = req.body;

    if (!user) {
      return res.status(400).json({ error: "User data is required" });
    }

    if (isRateLimited(`groq_${user.id}`)) {
      return res.status(429).json({
        error: "Too many requests. Please wait before trying again.",
      });
    }

    const prompt = `
    Summarize the following user in 1–2 sentences:
    Name: ${user.name}
    Role: ${user.role}
    Status: ${user.status}
    Language: ${user.language}
`;

    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const insights = response.choices[0].message.content;
    console.log("Groq insights generated:", insights);
    res.json({ insight: insights || "" });
  } catch (error) {
    console.error("Error generating Groq insights:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
