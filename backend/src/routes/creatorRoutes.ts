import express from "express";
import {
  createVideoForCreator,
  editVideoForCreator,
  deleteVideoForCreator,
  getVideoAnalyticsForCreator,
  getOverallAnalyticsForCreator,
  removeCreatorByAdmin,
  onboardCreatorHandler,
} from "../controllers/creatorController";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { createVideoSchema } from "../schema/video/videoSchema";

const router = express.Router();

// Creator routes
router.post(
  "/videos",
  authenticate,
  validate(createVideoSchema),
  createVideoForCreator
);
router.put("/videos/:id", authenticate, editVideoForCreator);
router.delete("/videos/:id", authenticate, deleteVideoForCreator);
router.get("/videos/:id/analytics", authenticate, getVideoAnalyticsForCreator);
router.get("/analytics", authenticate, getOverallAnalyticsForCreator);

// Route to onboard a creator
router.post("/onboard", authenticate, onboardCreatorHandler);

// Admin route
router.delete("/creators/:id", authenticate, removeCreatorByAdmin);

export default router;
