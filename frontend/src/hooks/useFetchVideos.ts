import { useState, useEffect } from "react";
import axios from "axios";
import { VideoCardProps } from "@/components/VideoCard";
import { useQuery } from "@tanstack/react-query";
import { videoService } from "@/services/modules/video";

interface UseFetchVideosOptions {
  category?: string;
  limit?: number;
  filterByPrice?: "free" | "paid" | null;
  page?: number;
}

export const useFetchVideos = ({
  category,
  limit = 8,
  filterByPrice,
  page = 1,
}: UseFetchVideosOptions = {}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["videos", { category, limit, filterByPrice }],
    queryFn: async () => {
      const priceType =
        filterByPrice === "free"
          ? "free"
          : filterByPrice === "paid"
          ? "paid"
          : undefined;

      const data = await videoService.getVideos({
        page,
        limit,
        category,
        priceType,
      });

      const { videos: fetchedVideos } = data;

      return fetchedVideos.map((video: any) => ({
        id: video.id,
        title: video.title,
        thumbnail:
          video.thumbnail ||
          "https://images.unsplash.com/photo-1581276879432-15e50529f34b?q=80&w=2070&auto=format&fit=crop",
        price: video.price || 0, // Default to free if price is not available
        category: video.category?.name || "Uncategorized",
        views: video.views || 0,
        duration: video.duration || "0:00",
      }));
    },
  });

  return { videos: data || [], isLoading, error };
};
