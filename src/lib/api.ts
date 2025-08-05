import axios from "axios";
import { supabase } from "./supabase";

const SESSION_ID_KEY = 'chatSessionId';

export const api = axios.create({
  baseURL: "", // Set to empty string, we will prepend the full URL in each request
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

  const response = await api.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/data/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const sendMessage = async (userMessage: string): Promise<{ answer: string; session_id?: string }> => {
  const currentSessionId = localStorage.getItem(SESSION_ID_KEY);

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
    const response = await api.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat`, {
      query: userMessage,
      session_id: currentSessionId,
    }, {
      headers: headers,
    });

    if (response.data.session_id) {
      localStorage.setItem(SESSION_ID_KEY, response.data.session_id);
    }

    return response.data;

  } catch (error) {
    console.error("Error sending message:", error);
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

  const headers: Record<string, string> = {};

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const url = currentSessionId ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/history?session_id=${currentSessionId}` : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/history`;

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

interface Message {
  sender: "user" | "ai";
  text: string;
  timestamp: string;
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
    await api.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat/clear`, {
      session_id: currentSessionId,
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