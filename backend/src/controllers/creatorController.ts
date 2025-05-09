import { Request, Response } from "express";
import {
  createVideo,
  editVideo,
  deleteVideo,
  getVideoAnalytics,
  getOverallAnalytics,
  removeCreator,
  onboardCreator,
  getCreator,
} from "../services/creatorService";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    isAdmin: boolean;
  };
}

export const createVideoForCreator = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User not authenticated.");

    const video = await createVideo(req.body, userId);
    res.status(201).json(video);
  } catch (error) {
    console.log("err", error);
    res.status(400).json({ error: error.message });
  }
};

export const editVideoForCreator = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) throw new Error("User not authenticated.");

    const updatedVideo = await editVideo(id, req.body, userId);
    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteVideoForCreator = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) throw new Error("User not authenticated.");

    await deleteVideo(id, userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getVideoAnalyticsForCreator = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    if (!userId) throw new Error("User not authenticated.");

    const analytics = await getVideoAnalytics(id, userId);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getOverallAnalyticsForCreator = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User not authenticated.");

    const analytics = await getOverallAnalytics(userId);
    res.status(200).json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeCreatorByAdmin = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.isAdmin) throw new Error("User not authorized.");
    const { id } = req.params;

    await removeCreator(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const onboardCreatorHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const { name } = req.body;

    if (!userId) throw new Error("User not authenticated.");
    if (!name) throw new Error("Name and email are required.");

    const creator = await onboardCreator(userId, name);
    res.status(201).json(creator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCreatorDetails = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error("User not authenticated.");
    const creator = getCreator(userId);
    res.status(200).json(creator);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
