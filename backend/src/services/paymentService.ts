import Razorpay from "razorpay";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log("Razorpay Key ID:", process.env.RAZORPAY_KEY_ID);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (
  userId: string,
  amount: number,
  currency: string
) => {
  const order = await razorpay.orders.create({
    amount: amount * 100, // Amount in paise
    currency,
    receipt: `receipt_${userId}_${Date.now()}`,
  });

  return order;
};

export const createPaymentRecord = async (
  userId: string,
  finalAmount: number,
  currency: string,
  razorpayId: string,
  discount: number,
  couponCode: string | null
) => {
  return prisma.payment.create({
    data: {
      userId,
      amount: finalAmount,
      currency,
      status: "created",
      razorpayId,
      discount,
      couponCode,
    },
  });
};

export const updatePaymentStatus = async (
  razorpayId: string,
  status: string
) => {
  return prisma.payment.update({
    where: { razorpayId },
    data: { status },
  });
};
