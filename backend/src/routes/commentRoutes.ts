import express from "express";
import {
  addComment,
  getComments,
  replyToComment,
} from "../controllers/commentController";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

// Add a comment to a video
router.post("/", authenticate, addComment);

// Reply to a comment
router.post("/:commentId/reply", authenticate, replyToComment);

// Get comments for a video
router.get("/video/:videoId/comments", getComments);

export default router;
