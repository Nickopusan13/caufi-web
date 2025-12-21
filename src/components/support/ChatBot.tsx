"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bot } from "lucide-react";
import { useChatBot } from "@/hooks/useChatBot";
import type { ChatRequest, ChatResponse } from "@/api/user";
import ToasterProvider from "../ToasterProvider";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! 👋 I'm your support assistant. Feel free to ask me anything — I'm here to help!",
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mutation = useChatBot();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    const request: ChatRequest = {
      prompt: currentInput,
      sessionId,
    };
    mutation.mutate(request, {
      onSuccess: (response: ChatResponse) => {
        if (response.sessionId && response.sessionId !== sessionId) {
          setSessionId(response.sessionId);
        }
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            response.reply || "Got it! Let me know if you need anything else.",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      },
      onError: () => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Oops! Something went wrong. Please try again in a moment.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      },
    });
  };
  return (
    <section className="py-20">
      <ToasterProvider />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-zinc-800 rounded-3xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700"
        >
          <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-7 h-7" />
                </div>
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-4 border-blue-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Live Support Chat</h2>
                <p className="text-blue-100">
                  {`We're online — average response time < 1 minute`}
                </p>
              </div>
            </div>
          </div>
          <div
            data-lenis-prevent
            className="h-108 overflow-y-auto p-6 space-y-5 bg-gray-50 dark:bg-zinc-900"
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-5 py-4 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-100 border border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {mutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-800 px-5 py-4 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 flex items-center gap-3">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <div className="flex space-x-1">
                    {[0, 0.1, 0.2].map((delay) => (
                      <motion.div
                        key={delay}
                        animate={{ y: [0, -6, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form
            onSubmit={handleSubmit}
            className="p-6 bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700"
          >
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 px-5 py-4 rounded-xl bg-gray-100 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 placeholder-gray-500"
                disabled={mutation.isPending}
              />
              <button
                type="submit"
                disabled={!input.trim() || mutation.isPending}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
