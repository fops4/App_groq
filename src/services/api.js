const API_URL = import.meta.env.VITE_API_URL || "https://d477-41-211-125-169.ngrok-free.app/api";

// Helper for headers to include ngrok skip warning
const getHeaders = (extraHeaders = {}) => ({
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true", // CRITICAL for ngrok testing
  ...extraHeaders
});

export const api = {
  async login(username, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error("Unauthorized");
    return res.json();
  },

  async getHistory(userId) {
    const res = await fetch(`${API_URL}/chat/history/${userId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error("History failed");
    return res.json();
  },

  async chatCompletions(payload, onChunk) {
    const res = await fetch(`${API_URL}/chat/completions`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Chat error");

    if (payload.stream) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.replace("data: ", "");
            if (dataStr === "[DONE]") return;
            try {
              const data = JSON.parse(dataStr);
              onChunk(data);
            } catch (e) {}
          }
        }
      }
    } else {
      return res.json();
    }
  }
};
