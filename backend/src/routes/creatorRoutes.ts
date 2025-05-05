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

const router = express.Router();

// Creator routes
router.post("/videos", createVideoForCreator);
router.put("/videos/:id", editVideoForCreator);
router.delete("/videos/:id", deleteVideoForCreator);
router.get("/videos/:id/analytics", getVideoAnalyticsForCreator);
router.get("/analytics", getOverallAnalyticsForCreator);

// Route to onboard a creator
router.post("/onboard", onboardCreatorHandler);

// Admin route
router.delete("/creators/:id", removeCreatorByAdmin);

export default router;
