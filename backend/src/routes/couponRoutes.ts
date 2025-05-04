import { Router } from "express";
import {
  checkCouponValidity,
  createCoupon,
  disableCouponCode,
  enableCouponCode,
} from "../controllers/couponController";
import { authenticate } from "../middleware/authenticate";

const router = Router();

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     summary: Validate a coupon code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The coupon code to validate.
 *               amount:
 *                 type: number
 *                 description: The amount to validate against the coupon.
 *     responses:
 *       200:
 *         description: Coupon is valid.
 *       400:
 *         description: Invalid coupon code or conditions not met.
 */
router.post("/validate", authenticate, checkCouponValidity);

/**
 * @swagger
 * /coupons/create-coupon:
 *   post:
 *     summary: Create a new coupon
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The coupon code.
 *               discountType:
 *                 type: string
 *                 description: The type of discount (percentage or flat).
 *               discountValue:
 *                 type: number
 *                 description: The value of the discount.
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *                 description: The expiry date of the coupon.
 *     responses:
 *       201:
 *         description: Coupon created successfully.
 */
router.post("create-coupon", authenticate, createCoupon);

// Disable Coupon Code
/**
 * @swagger
 * /coupons/disable/{couponId}:
 *   patch:
 *     summary: Disable a coupon code
 *     parameters:
 *       - name: couponId
 *         in: path
 *         required: true
 *         description: The ID of the coupon to disable.
 *     responses:
 *       200:
 *         description: Coupon disabled successfully.
 */
router.patch("/disable/:couponId", authenticate, disableCouponCode);

// enable Coupon Code
/**
 * @swagger
 * /coupons/enable/{couponId}?expirationDate={expirationDate}:
 *   patch:
 *     summary: Enable a coupon code
 *     parameters:
 *       - name: couponId
 *         in: path
 *         required: true
 *         description: The ID of the coupon to enable.
 *       - name: expirationDate
 *         in: query
 *         required: true
 *         description: The new expiration date for the coupon.
 *     responses:
 *       200:
 *         description: Coupon enabled successfully.
 */
router.patch("/enable/:couponId", authenticate, enableCouponCode);

export default router;
