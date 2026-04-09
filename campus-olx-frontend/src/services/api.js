import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
};

// Item APIs
export const itemAPI = {
  getItems: (params) => api.get("/items", { params }),
  getMyItems: () => api.get("/items/my"),
  getItemById: (id) => api.get(`/items/${id}`),
  addItem: (formData) => api.post("/items/add", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  updateItem: (id, data) => api.put(`/items/${id}`, data),
  markAsSold: (id) => api.put(`/items/sold/${id}`),
  removeItem: (id) => api.put(`/items/remove/${id}`),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => api.put("/user/profile", data),
  getPublicProfile: (id) => api.get(`/user/${id}`),
};

export default api;
