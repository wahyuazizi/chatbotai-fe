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
  (config) => {
    // This interceptor is for the backend's custom token, if any.
    // For Supabase Auth, the token is added directly in sendMessage.
    const token = localStorage.getItem("token"); // This might be from a custom backend auth
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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