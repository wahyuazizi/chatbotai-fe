import axios from "axios";
import { supabase } from "./supabase";

const SESSION_ID_KEY = 'chatSessionId';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000", // Ganti dengan URL API backend Anda
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error("Error getting Supabase session for API request:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const upload = async (files: File[]): Promise<{ message: string }> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("file", file);
  });

  const response = await api.post("/data/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const sendMessage = async (userMessage: string): Promise<{ answer: string; session_id?: string }> => {
  // 1. Baca session_id yang ada dari localStorage
  const currentSessionId = localStorage.getItem(SESSION_ID_KEY);

  // 2. Dapatkan Auth Token dari Supabase (jika pengguna login)
  let authToken: string | null = null;
  try {
    const { data: { session },
      } = await supabase.auth.getSession();
    if (session) {
      authToken = session.access_token;
    }
  } catch (error) {
    console.error("Error getting Supabase session:", error);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await api.post("/api/v1/chat", {
      query: userMessage,
      session_id: currentSessionId, // Kirim ID yang ada, atau null jika tidak ada
    }, {
      headers: headers,
    });

    // 3. Ambil session_id dari respons dan simpan kembali
    // Ini akan menangani sesi baru dan sesi yang sudah ada secara otomatis
    if (response.data.session_id) {
      localStorage.setItem(SESSION_ID_KEY, response.data.session_id);
    }

    // 4. Kembalikan data untuk ditampilkan di UI
    return response.data;

  } catch (error) {
    console.error("Error sending message:", error);
    // Handle error di UI (misalnya, tampilkan pesan kesalahan)
    throw error;
  }
};

export const getChatHistory = async (): Promise<Message[]> => {
  const currentSessionId = localStorage.getItem(SESSION_ID_KEY);

  let authToken: string | null = null;
  try {
    const { data: { session },
      } = await supabase.auth.getSession();
    if (session) {
      authToken = session.access_token;
    }
  } catch (error) {
    console.error("Error getting Supabase session for history:", error);
  }

  const headers: Record<string, string> = {}; // No Content-Type for GET

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  // Add session_id as a query parameter for GET request
  const url = currentSessionId ? `/api/v1/chat/history?session_id=${currentSessionId}` : "/api/v1/chat/history";

  try {
    const response = await api.get(url, {
      headers: headers,
    });

    const data = response.data;
    console.log("API: getChatHistory response data:", data);
    
    let history: Message[] = [];
    if (Array.isArray(data)) {
      history = data;
    } else if (data && Array.isArray(data.history)) {
      history = data.history;
    }

    return history.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp).toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

// Define Message interface if not already defined in this file
interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string; // Ensure this is a string
}

export const clearChatHistory = async (): Promise<void> => {
  const currentSessionId = localStorage.getItem(SESSION_ID_KEY);

  let authToken: string | null = null;
  try {
    const { data: { session },
      } = await supabase.auth.getSession();
    if (session) {
      authToken = session.access_token;
    }
  } catch (error) {
    console.error("Error getting Supabase session for clearing history:", error);
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    await api.post("/api/v1/chat/clear", {
      session_id: currentSessionId, // Send session_id to clear specific session
    }, {
      headers: headers,
    });

    console.log("Chat history cleared successfully on backend.");
  } catch (error) {
    console.error("Error clearing chat history:", error);
    throw error;
  }
};

export const getSessionId = (): string | null => {
  return localStorage.getItem(SESSION_ID_KEY);
};
