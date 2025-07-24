"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  LogOut, 
  Bot, 
  User, 
  Copy, 
  RotateCcw,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { 
      sender: "user", 
      text: input.trim(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const response = await api.post("/chat", { query: input.trim() });
      const aiMessage: Message = { 
        sender: "ai", 
        text: response.data.answer,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { 
          sender: "ai", 
          text: "Maaf, saya mengalami kendala saat memproses pertanyaan Anda. Silakan coba lagi.",
          timestamp: new Date()
        },
      ]);
      
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const handleLogout = () => {
    logout();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Campus Assistant
              </h1>
              <p className="text-sm text-gray-500">Powered by Microsoft Azure</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {messages.length > 0 && (
              <Button
                onClick={clearChat}
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/login")}
                variant="ghost"
                size="sm"
                className="text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <MessageSquare className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Selamat Datang di Campus Assistant! 🎓
              </h2>
              <p className="text-gray-600 max-w-lg text-lg leading-relaxed mb-6">
                Halo! Saya adalah asisten virtual kampus yang siap membantu Anda mendapatkan informasi seputar kampus menggunakan teknologi <strong>RAG (Retrieval-Augmented Generation)</strong>.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 max-w-2xl">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">
                  💡 Apa yang bisa saya bantu?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-700">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Informasi program studi</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Syarat pendaftaran mahasiswa baru</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Fasilitas kampus</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Informasi beasiswa</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Kegiatan mahasiswa</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span>Kalender akademik</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-6">
                🚀 Didukung oleh <strong>Microsoft Azure</strong> untuk pengalaman terbaik
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex max-w-[85%] space-x-3 ${msg.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.sender === "user" 
                        ? "bg-gradient-to-r from-emerald-500 to-green-500" 
                        : "bg-gradient-to-r from-gray-600 to-gray-700"
                    }`}>
                      {msg.sender === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Message */}
                    <div className="flex flex-col">
                      <div
                        className={`group relative px-4 py-3 rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        } ${msg.sender === "user" ? "rounded-br-md" : "rounded-bl-md"}`}
                      >
                        <div className="prose prose-sm max-w-none">
                          {msg.text.split('\n').map((line, lineIndex) => (
                            <p key={lineIndex} className={`${lineIndex === 0 ? 'mt-0' : 'mt-2'} ${msg.sender === "user" ? "text-white" : "text-gray-800"} leading-relaxed`}>
                              {line || '\u00A0'}
                            </p>
                          ))}
                        </div>

                        {/* Copy button for AI messages */}
                        {msg.sender === "ai" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-gray-200"
                            onClick={() => copyToClipboard(msg.text, index)}
                          >
                            <Copy className="w-3 h-3 text-gray-600" />
                          </Button>
                        )}

                        {copiedIndex === index && (
                          <div className="absolute -top-8 right-0 bg-gray-800 text-white text-xs px-2 py-1 rounded animate-in slide-in-from-bottom-1 duration-200">
                            Copied!
                          </div>
                        )}
                      </div>
                      
                      {/* Timestamp */}
                      <div className={`text-xs text-gray-500 mt-1 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        </div>
                        <span className="text-sm text-gray-600">Asisten sedang mengetik...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative">
            <div className="flex items-end space-x-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-300 transition-all duration-200">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan seputar kampus... (Tekan Enter untuk mengirim, Shift+Enter untuk baris baru)"
                className="flex-1 bg-transparent border-0 outline-none resize-none min-h-[20px] max-h-[120px] placeholder-gray-500 text-gray-800 px-2 py-2"
                disabled={loading}
                rows={1}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-xl h-9 w-9 p-0 flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-between items-center mt-2 px-2">
              <p className="text-xs text-gray-500">
                Tekan Shift + Enter untuk baris baru
              </p>
              <p className="text-xs text-gray-500">
                {input.length} characters
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}