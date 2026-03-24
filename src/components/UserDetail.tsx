import React, { useState, useEffect } from "react";
import { UserSchema } from "../types/user";
import { generateUserInsightsClaude } from "../service/anthropicCode";
import {
  generateUserInsights,
  generateMockInsights,
} from "../service/openaicode";

import { generateGroqInsights } from "../service/groqapi";
interface Props {
  user: UserSchema | null;
}

const UserDetails = ({ user }: Props) => {
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!user) {
      setInsight("");
      setError("");
      return;
    }

    // store insights in localStorage to avoid redundant API calls - cache
    const cached = localStorage.getItem(`insight_${user.id}`);
    if (cached) {
      setInsight(cached);
      setError("");
    } else {
      // Clear insight when user changes
      setInsight("");
      setError("");
    }
  }, [user?.id]);

  const handleGenerate = async () => {
    if (!user || loading) return;

    setLoading(true);
    setError("");

    try {
      //const result = await generateUserInsightsClaude(user); // as it require cost i implemented but not working will get error
      //const result = await generateMockInsights(user); // dummay value it will return
      //const result = await generateUserInsights(user);

      const result = await generateGroqInsights(user);
      setInsight(result);
      // Cache result
      localStorage.setItem(`insight_${user.id}`, result);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to generate insights. Try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      //const result = await generateUserInsightsClaude(user); // as it require cost i implemented but not working will get error
      //const result = await generateMockInsights(user); // dummay value it will return
      //const result = await generateUserInsights(user);

      const result = await generateGroqInsights(user);
      setInsight(result);
      localStorage.setItem(`insight_${user.id}`, result);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Failed to regenerate insights. Try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Select a user to view details.</p>;

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}
    >
      <h3>{user.name}'s Details</h3>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Status:</strong> {user.status}
      </p>
      <p>
        <strong>Language:</strong> {user.language}
      </p>

      {!insight ? (
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "8px 16px",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Generating..." : "Generate Insights"}
        </button>
      ) : (
        <>
          <div
            style={{
              backgroundColor: "#f0f8ff",
              padding: "12px",
              borderRadius: "4px",
              marginTop: "16px",
            }}
          >
            <p>
              <strong>Insights:</strong>
            </p>
            <p className="insight">{insight}</p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={loading}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              marginTop: "12px",
            }}
          >
            {loading ? "Regenerating..." : "Regenerate Insights"}
          </button>
        </>
      )}

      {error && (
        <p
          style={{
            color: "red",
            marginTop: "12px",
            padding: "8px",
            backgroundColor: "#ffe6e6",
            borderRadius: "4px",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default UserDetails;
