"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Bot, RotateCcw } from "lucide-react";
import ProductCard from "./ProductCard";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: any[];
}

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm AgentCart, your personal AI shopping assistant. What are you looking for today? (e.g., 'Best gaming mouse under ₹2000')"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reasoning || data.message || "Something went wrong.",
        recommendations: data.recommendations
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I'm having trouble connecting to the catalog. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([{
      id: "1",
      role: "assistant",
      content: "Hello! I'm AgentCart, your personal AI shopping assistant. What are you looking for today?"
    }]);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">AgentCart</h1>
        </div>
        <button 
          onClick={resetChat}
          className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          title="Reset Chat"
        >
          <RotateCcw className="w-5 h-5 text-zinc-500" />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto mb-6 space-y-6 scrollbar-hide pr-2"
      >
        <AnimatePresence>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                m.role === "user" ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-800"
              }`}>
                {m.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-indigo-500" />}
              </div>

              <div className={`flex flex-col max-w-[85%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`p-4 rounded-2xl ${
                  m.role === "user" 
                    ? "bg-indigo-600 text-white" 
                    : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                } shadow-sm`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                </div>

                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                    {m.recommendations.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4 items-center"
          >
            <div className="bg-zinc-200 dark:bg-zinc-800 w-8 h-8 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-indigo-500 animate-pulse" />
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-2xl">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
              </div>
            </div>
            <span className="text-xs text-zinc-400 font-medium">Agent is thinking...</span>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-center"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What are you looking for?"
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xl transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-3 p-2.5 bg-indigo-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
      
      <p className="mt-4 text-center text-xs text-zinc-400">
        AgentCart AI Shopping Agent · Mock Dataset Version
      </p>
    </div>
  );
}
