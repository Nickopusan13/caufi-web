import { useMutation } from "@tanstack/react-query";
import { apiChatBot, type ChatRequest, type ChatResponse } from "@/api/user";

export function useChatBot() {
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: apiChatBot,
  });
}
