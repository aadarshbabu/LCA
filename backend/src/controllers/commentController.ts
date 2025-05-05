import { Request, Response } from "express";
import {
  addCommentToVideo,
  getVideoComments,
  replyComment,
} from "../services/commentService";

// Add a comment to a video
export const addComment = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { content, videoId } = req.body;
    const comment = await addCommentToVideo(content, videoId, userId);
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reply to a comment
export const replyToComment = async (req: Request, res: Response) => {
  try {
    const { content, videoId } = req.body;
    const { commentId } = req.params; // it's a parent comment
    const userId = req.user.id;
    const reply = await replyComment({
      content,
      videoId,
      userId,
      parentId: commentId,
    });
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get comments for a video
export const getComments = async (req: Request, res: Response) => {
  try {
    const { videoId } = req.params;
    const comments = await getVideoComments(videoId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
