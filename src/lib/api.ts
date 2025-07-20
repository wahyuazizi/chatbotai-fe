import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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

export default api;
