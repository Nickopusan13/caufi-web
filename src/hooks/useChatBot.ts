import { useMutation } from "@tanstack/react-query";
import { apiChatBot, type ChatRequest, type ChatResponse } from "@/api/user";
import toast from "react-hot-toast";

export function useChatBot() {
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: apiChatBot,
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
