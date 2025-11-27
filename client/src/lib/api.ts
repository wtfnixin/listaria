import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export interface Ad {
  _id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  subcategory: string;
  condition: string;
  images: string[];
  location: string;
  phone: string;
  showPhone: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  isFeatured: boolean;
  status: "active" | "sold" | "expired";
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdData {
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  condition: string;
  images: string[];
  location: string;
  phone: string;
  showPhone: boolean;
}

export interface AdFilters {
  category?: string;
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  page?: number;
  limit?: number;
}

export interface UserProfile {
  _id: string;
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  location?: string;
  createdAt: string;
}

export const adApi = {
  getAll: async (filters?: AdFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get<{ ads: Ad[]; total: number; page: number }>(
      `/ads?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Ad>(`/ads/${id}`);
    return response.data;
  },

  create: async (data: CreateAdData) => {
    const response = await api.post<Ad>("/ads", data);
    return response.data;
  },

  update: async (id: string, data: Partial<CreateAdData>) => {
    const response = await api.put<Ad>(`/ads/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/ads/${id}`);
    return response.data;
  },

  getMyAds: async () => {
    const response = await api.get<Ad[]>("/ads/my");
    return response.data;
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    const response = await api.post<{ urls: string[] }>("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.urls;
  },
};

export const userApi = {
  getProfile: async () => {
    const response = await api.get<UserProfile>("/users/profile");
    return response.data;
  },

  updateProfile: async (data: Partial<UserProfile>) => {
    const response = await api.put<UserProfile>("/users/profile", data);
    return response.data;
  },

  createProfile: async (data: {
    uid: string;
    email: string;
    displayName: string;
    photoURL?: string;
  }) => {
    const response = await api.post<UserProfile>("/users", data);
    return response.data;
  },
};

export const favoriteApi = {
  getAll: async () => {
    const response = await api.get<Ad[]>("/favorites");
    return response.data;
  },

  add: async (adId: string) => {
    const response = await api.post(`/favorites/${adId}`);
    return response.data;
  },

  remove: async (adId: string) => {
    const response = await api.delete(`/favorites/${adId}`);
    return response.data;
  },

  check: async (adId: string) => {
    const response = await api.get<{ isFavorite: boolean }>(
      `/favorites/check/${adId}`
    );
    return response.data.isFavorite;
  },
};

export default api;
