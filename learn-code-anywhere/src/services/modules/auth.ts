import axios from "axios";
import { apiClient } from "..";

// register userData Type
export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// login userData Type
export interface LoginUserData {
  email: string;
  password: string;
}

// Define the type for Profile data
export interface ProfileData {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  profilePictureUrl: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  type: string;
  isVerified: boolean;
  isAdmin: boolean;
  wallet: {
    id: string;
    balance: number;
  };
}

export const authService = {
  // Function to register a new user
  register: async (userData: RegisterUserData) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  // Function to login a user
  login: async (credentials: LoginUserData) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  // Function to get the profile of a user
  getProfile: async (): Promise<ProfileData> => {
    try {
      const response = await apiClient.get("/auth/profile");
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  // Function to logout a user
  // logout: async () => {
  //     try {
  //         const response = await axios.post('/api/auth/logout');
  //         return response.data;
  //     } catch (error) {
  //         throw error.response.data;

  //     }
  // }
};
