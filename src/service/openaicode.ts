import { UserSchema } from "../types/user";

export const generateMockInsights = async (user: UserSchema) => {
  return `${user.name} is an ${user.status.toLowerCase()} ${user.role} who communicates in ${user.language}.`;
};

export const generateUserInsights = async (user: UserSchema): Promise<string> => {
  try {
    const response = await fetch("http://localhost:5000/api/generate-openai-insight", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch AI response");
    }

    const data = await response.json();
    return data.insight;
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw error;
  }
};