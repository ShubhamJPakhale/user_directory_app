import { UserSchema } from "../types/user";

export const generateGroqInsights = async (user: UserSchema): Promise<string> => {
  try {
    const response = await fetch("http://localhost:5000/api/generate-groq-insight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch Groq response");
    }

    const data = await response.json();
    return data.insight;
  } catch (error) {
    console.error("Groq Error:", error);
    throw error;
  }
};