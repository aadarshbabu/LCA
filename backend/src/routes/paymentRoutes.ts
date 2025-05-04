import { Router } from "express";
import {
  initiatePayment,
  handleWebhook,
  confirmPayment,
} from "../controllers/paymentController";
import { authenticate } from "../middleware/authenticate";

const router = Router();

/**
 * @swagger
 * /payments/initiate:
 *   post:
 *     summary: Initiate a payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to be paid.
 *               currency:
 *                 type: string
 *                 description: The currency of the payment.
 *               couponCode:
 *                 type: string
 *                 description: (Optional) The coupon code to apply.
 *     responses:
 *       200:
 *         description: Payment initiated successfully.
 *       400:
 *         description: Error initiating payment.
 */

router.post("/initiate", authenticate, initiatePayment);

/**
 * @swagger
 * /payments/confirm:
 *   post:
 *     summary: Confirm a payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               razorpayId:
 *                 type: string
 *                 description: The Razorpay payment ID.
 *               razorpayOrderId:
 *                 type: string
 *                 description: The Razorpay order ID.
 *               razorpaySignature:
 *                 type: string
 *                 description: The Razorpay signature for verification.
 *     responses:
 *       200:
 *         description: Payment confirmed successfully.
 *       400:
 *         description: Error confirming payment.
 */

router.post("/confirm", authenticate, confirmPayment);

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Handle Razorpay webhook events
 *     responses:
 *       200:
 *         description: Webhook processed successfully.
 *       400:
 *         description: Error processing webhook.
 */

router.post("/webhook", handleWebhook);

export default router;
