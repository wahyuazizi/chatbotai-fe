import axios from "axios";
import { supabase } from "./supabase";

const SESSION_ID_KEY = 'chatSessionId';

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
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

export const upload = async (file: File): Promise<{ message: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/data/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const sendMessage = async (userMessage: string): Promise<any> => {
  const apiEndpoint = "http://127.0.0.1:8000/api/v1/chat"; // Ensure this is correct

  // 1. Baca session_id yang ada dari localStorage
  const currentSessionId = localStorage.getItem(SESSION_ID_KEY);

  // 2. Dapatkan Auth Token dari Supabase (jika pengguna login)
  let authToken: string | null = null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
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
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        query: userMessage,
        session_id: currentSessionId, // Kirim ID yang ada, atau null jika tidak ada
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 3. Ambil session_id dari respons dan simpan kembali
    // Ini akan menangani sesi baru dan sesi yang sudah ada secara otomatis
    if (data.session_id) {
      localStorage.setItem(SESSION_ID_KEY, data.session_id);
    }

    // 4. Kembalikan data untuk ditampilkan di UI
    return data;

  } catch (error) {
    console.error("Error sending message:", error);
    // Handle error di UI (misalnya, tampilkan pesan kesalahan)
    throw error;
  }
};

export const getChatHistory = async (): Promise<Message[]> => {
  const apiEndpoint = "http://127.0.0.1:8000/api/v1/chat/history"; // Ganti dengan URL API riwayat chat Anda

  const currentSessionId = localStorage.getItem(SESSION_ID_KEY);

  let authToken: string | null = null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
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
  const url = currentSessionId ? `${apiEndpoint}?session_id=${currentSessionId}` : apiEndpoint;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API: getChatHistory response data:", data);
    
    let history: any[] = [];
    if (Array.isArray(data)) {
      history = data;
    } else if (data && Array.isArray(data.history)) {
      history = data.history;
    }

    return history.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
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
  timestamp: Date; // Changed to Date object
}

export const clearChatHistory = async (): Promise<void> => {
  const apiEndpoint = "http://127.0.0.1:8000/api/v1/chat/clear"; // Ganti dengan URL API untuk menghapus riwayat chat

  const currentSessionId = localStorage.getItem(SESSION_ID_KEY);

  let authToken: string | null = null;
  try {
    const { data: { session } } = await supabase.auth.getSession();
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
    const response = await fetch(apiEndpoint, {
      method: 'POST', // Or DELETE, depending on your backend
      headers: headers,
      body: JSON.stringify({
        session_id: currentSessionId, // Send session_id to clear specific session
      }),
      mode: 'cors',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log("Chat history cleared successfully on backend.");
  } catch (error) {
    console.error("Error clearing chat history:", error);
    throw error;
  }
};