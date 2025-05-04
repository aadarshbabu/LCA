import { apiClient } from "..";
import { AxiosError } from "axios";

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  categoryId: string;
  views: number;
  duration: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  description: string;
  url: string;
  resolutions: Record<string, unknown>;
  isYoutubeUrl: boolean;
  category: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    profilePictureUrl: string;
    firstName: string;
    lastName: string;
  };
}

export const videoService = {
  async getVideos({ page, limit, category, priceType }) {
    try {
      const res = await apiClient.get("/videos", {
        params: {
          page,
          limit,
          category,
          priceType,
        },
      });
      return res.data;
    } catch (e) {
      throw e;
    }
  },

  async popularCategories() {
    try {
      const res = await apiClient.get("categories/popular-categories");
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  async fetchVideoById(videoId: string): Promise<Video> {
    try {
      const res = await apiClient.get<Video>(`videos/${videoId}`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error; // Throw Axios error for useQuery to handle
      }
      throw error;
    }
  },

  async pendingVideoList() {
    try {
      const res = await apiClient.get("/videos/pending-videos");
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  async approvedVideo(id: string) {
    try {
      const res = await apiClient.patch(`/videos/${id}`);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
};
