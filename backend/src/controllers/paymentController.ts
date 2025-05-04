import { Request, Response } from "express";
import {
  createOrder,
  updatePaymentStatus,
  createPaymentRecord,
} from "../services/paymentService";
import { addMoneyToWallet } from "../services/walletService";
import { validateCoupon } from "../services/couponService";
import crypto from "crypto";

export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { amount, currency, couponCode } = req.body;
    if (!userId) throw new Error("User not authenticated.");

    let discount = 0;
    let coupon = null;

    if (couponCode) {
      const result = await validateCoupon(couponCode, amount, userId);
      discount = result.discount;
      coupon = result.coupon;
    }

    const finalAmount = amount - discount;
    if (finalAmount <= 0)
      throw new Error("Final amount must be greater than zero.");

    const order = await createOrder(userId, finalAmount, currency);

    await createPaymentRecord(
      userId,
      finalAmount,
      currency,
      order.id,
      discount,
      coupon?.code || null
    );

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { razorpayId, razorpayOrderId, razorpaySignature } = req.body;
    if (!userId) throw new Error("User not authenticated.");

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpayOrderId}|${razorpayId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      throw new Error("Invalid payment signature.");
    }

    // Verify payment status
    const payment = await updatePaymentStatus(razorpayId, "captured");
    if (payment.status !== "captured") {
      throw new Error("Payment not verified.");
    }

    // Add total amount (payment amount + discount) to wallet
    const totalAmount = payment.amount + payment.discount;
    await addMoneyToWallet(userId, totalAmount);

    res.status(200).json({ message: "Payment confirmed and wallet updated." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { event, payload } = req.body;

    if (event === "payment.captured") {
      const { id, amount, notes } = payload.payment.entity;
      const payment = await updatePaymentStatus(id, "captured");

      // Add total amount (payment amount + discount) to wallet
      if (notes && notes.userId) {
        const totalAmount = payment.amount + payment.discount;
        await addMoneyToWallet(notes.userId, totalAmount);
      }
    } else if (event === "payment.failed") {
      const { id } = payload.payment.entity;
      await updatePaymentStatus(id, "failed");
    }

    res.status(200).json({ message: "Webhook processed successfully." });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
