import { Router } from "express";
import { addMoney, buyVideo } from "../controllers/walletController";
import { authenticate } from "../middleware/authenticate";

const router = Router();

/**
 * @swagger
 * /wallet/buy-video:
 *   post:
 *     summary: Purchase a video using wallet balance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 *                 description: The ID of the video to purchase.
 *     responses:
 *       200:
 *         description: Video purchased successfully.
 *       400:
 *         description: Insufficient wallet balance or other error.
 */
router.post("/buy-video", authenticate, buyVideo);

router.post("/add-amount", authenticate, addMoney);

export default router;
