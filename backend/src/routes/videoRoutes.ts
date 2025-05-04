import { Router } from "express";
import {
  getVideos,
  getVideo,
  createVideo,
  approveVideoById,
  checkVideoPurchase,
  getSuggestedVideos,
  searchVideos,
  getPendingVideos,
  rejectVideoById,
} from "../controllers/videoController";
import { authenticate } from "../middleware/authenticate";
import { attachUserInReq } from "../middleware/attachUserInReq";

const router = Router();

/**
 * @swagger
 * /videos:
 *   get:
 *     summary: Retrieve a list of videos
 *     responses:
 *       200:
 *         description: A list of videos.
 *   post:
 *     summary: Create a new video
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the video.
 *               thumbnail:
 *                 type: string
 *                 description: The thumbnail URL of the video.
 *               price:
 *                 type: number
 *                 description: The price of the video.
 *               categoryId:
 *                 type: string
 *                 description: The ID of the category the video belongs to.
 *               duration:
 *                 type: string
 *                 description: The duration of the video.
 *               url:
 *                type: string
 *                description: The URL of the video.
 *               isYoutubeUrl:
 *                type: boolean
 *                description: Indicates if the URL is a YouTube URL.
 *               resolutions:
 *                type: string
 *                description: The resolutions available for the video.
 *
 *
 *     responses:
 *       201:
 *         description: Video created successfully.
 */

/**
 * @swagger
 * /videos/{id}:
 *   get:
 *     summary: Retrieve a single video by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The video ID
 *     responses:
 *       200:
 *         description: A single video.
 *       404:
 *         description: Video not found.
 */

/**
 * @swagger
 * /videos/{id}/approve:
 *   patch:
 *     summary: Approve a video by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The video ID
 *     responses:
 *       200:
 *         description: Video approved successfully.
 *       404:
 *         description: Video not found.
 */

/**
 * @swagger
 * /videos/{videoId}/purchased:
 *   get:
 *     summary: Check if a video has been purchased by the user
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: The video ID
 *     responses:
 *       200:
 *         description: Video purchase status.
 *       404:
 *         description: Video not found.
 */

/**
 * @swagger
 * /videos/{id}/suggested:
 *   get:
 *     summary: Retrieve suggested videos based on the current video
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The video ID
 *     responses:
 *       200:
 *         description: A list of suggested videos.
 */

/**
 * @swagger
 * /videos/search:
 *   get:
 *     summary: Search for videos by title
 *     parameters:
 *       - in: query
 *         name: term
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term
 *     responses:
 *       200:
 *         description: A list of videos matching the search term.
 */

router.get("/", getVideos);
// ✅ Specific static routes FIRST
router.get("/search", searchVideos);
router.post("/", authenticate, createVideo);
router.get("/pending-videos", getPendingVideos);

// ✅ Routes with subpaths next (more specific dynamic patterns)
router.get("/:id/suggested", getSuggestedVideos);
router.get("/:videoId/purchased", authenticate, checkVideoPurchase);
router.patch("/:id/approve", authenticate, approveVideoById);
router.patch("/:id/reject", rejectVideoById);

// ✅ General dynamic route LAST
router.get("/:id", attachUserInReq, getVideo);

export default router;
