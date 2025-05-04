import { Request, Response } from "express";
import {
  listVideos,
  getVideoById,
  submitVideo,
  approveVideo,
  isVideoPurchased,
  getPaginatedVideos,
} from "../services/videoService";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
}

export const getVideos = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, category, priceType } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber <= 0 ||
      limitNumber <= 0
    ) {
      res.status(400).json({ error: "Invalid pagination parameters." });
      return;
    }

    const { videos, total } = await getPaginatedVideos(
      pageNumber,
      limitNumber,
      category as string,
      priceType as string
    );

    res.status(200).json({
      page: pageNumber,
      limit: limitNumber,
      total,
      videos,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVideo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const video = await getVideoById(id);
    if (!video) {
      res.status(404).json({ error: "Video not found" });
      return;
    }

    if (video.price > 0) {
      if (!userId) {
        res
          .status(401)
          .json({
            error: "Authentication required to access this video.",
            userId,
            login: false,
          });
        return;
      }

      const purchased = await isVideoPurchased(userId, id);
      if (!purchased) {
        res
          .status(403)
          .json({ error: "You need to purchase this video to access it." });
        return;
      }
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createVideo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const isAdmin = req.user?.isAdmin || false;
    const userId = req.user?.id || ""; // Ensure userId is provided
    const video = await submitVideo(req.body, userId, isAdmin);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const approveVideoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const video = await approveVideo(id);
    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const checkVideoPurchase = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { videoId } = req.params;
    if (!userId) throw new Error("User not authenticated.");

    const purchased = await isVideoPurchased(userId, videoId);
    res.status(200).json({ purchased });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSuggestedVideos = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const video = await getVideoById(id);
    if (!video) {
      res.status(404).json({ error: "Video not found" });
      return;
    }

    const suggestedVideos = await listVideos();
    const filteredVideos = suggestedVideos.filter(
      (v) => v.categoryId === video.categoryId && v.id !== video.id
    );

    res.status(200).json(filteredVideos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchVideos = async (req: Request, res: Response) => {
  try {
    console.log("Search request received:", req.query); // Debugging line

    const { term } = req.query;
    if (!term || typeof term !== "string") {
      res
        .status(400)
        .json({ error: "Search term is required and must be a string." });
      return;
    }

    const videos = await listVideos();
    const filteredVideos = videos.filter((video) =>
      video.title.toLowerCase().includes(term.toLowerCase())
    );

    res.status(200).json(filteredVideos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
