export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export function getChatHistory(chatId: string): ChatMessage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(`emo:chat:${chatId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveChatHistory(chatId: string, messages: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`emo:chat:${chatId}`, JSON.stringify(messages));
  } catch (e) {
    console.error("Failed to save chat history", e);
  }
}

export function clearChatHistory(chatId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(`emo:chat:${chatId}`);
}
