import { UserSchema } from "../types/user";

export const generateUserInsightsClaude = async (
  user: UserSchema
): Promise<string> => {
  try {
    console.log("Calling Anthropic API with user:", user);
    const response = await fetch("http://localhost:5000/api/generate-anthropic-insight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${JSON.stringify(data)}`);
    }

    if (!data.insight) {
      throw new Error("No insight returned from API");
    }

    return data.insight;
  } catch (error) {
    console.error("Claude Error:", error);
    throw error;
  }
};