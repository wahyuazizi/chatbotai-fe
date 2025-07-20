"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await api.post("/chat", { query: input });
      const aiMessage: Message = { sender: "ai", text: response.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Sorry, something went wrong." },
      ]);
      if (error.response?.status === 401) {
        router.push("/login"); // Redirect to login if token is invalid/expired
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold">Chatbot AI</h1>
        <div>
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === "user"
                  ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-800"}
              `}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-300 text-gray-800">
              Typing...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSendMessage} className="bg-white p-4 shadow-md flex">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 mr-2"
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          Send
        </Button>
      </form>
    </div>
  );
}