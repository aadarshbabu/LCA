import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const validateCoupon = async (
  code: string,
  amount: number,
  userId: string
) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code },
    include: { redeemedBy: true },
  });
  if (!coupon) throw new Error("Invalid coupon code.");
  if (new Date() > coupon.expiryDate) throw new Error("Coupon has expired.");
  if (amount < coupon.minValue)
    throw new Error(
      "Order value does not meet the minimum requirement for this coupon."
    );
  if (coupon.redeemedBy.length >= coupon.maxUsers)
    throw new Error("Coupon redemption limit reached.");
  if (coupon.redeemedBy.some((redemption) => redemption.userId === userId)) {
    throw new Error("You have already redeemed this coupon.");
  }

  const discount = coupon.isPercentage
    ? (amount * coupon.discount) / 100
    : coupon.discount;
  return { discount, coupon };
};

export const createCouponService = async ({
  code,
  discount,
  expirationDate,
  isPercentage,
  minValue,
  maxUsers,
}: {
  code: string;
  discount: number;
  expirationDate: string;
  isPercentage?: boolean;
  minValue?: number;
  maxUsers?: number;
}) => {
  // Assuming you have a Coupon model or similar to interact with the database
  const newCoupon = await prisma.coupon.create({
    data: {
      code,
      discount,
      expiryDate: new Date(expirationDate),
      isPercentage: isPercentage || false, // Assuming percentage if discount is greater than 1
      minValue: minValue, // Set a default minimum value or adjust as needed
      maxUsers: maxUsers, // Set a default maximum number of users or adjust as needed
    },
  });
  return newCoupon;
};

export const redeemCoupon = async (userId: string, couponId: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  const redeemedBy = await prisma.couponRedemption.count({
    where: { couponId },
  });
  if (!coupon) throw new Error("Coupon not found.");
  if (new Date() > coupon.expiryDate) throw new Error("Coupon has expired.");
  if (redeemedBy >= coupon.maxUsers)
    throw new Error("Coupon redemption limit reached.");

  // Check if the user has already redeemed this coupon
  const alreadyRedeemed = await prisma.couponRedemption.findUnique({
    where: {
      userId_couponId: {
        userId,
        couponId,
      },
    },
  });
  if (alreadyRedeemed) {
    throw new Error("You have already redeemed this coupon.");
  }

  await prisma.couponRedemption.create({
    data: {
      userId,
      couponId,
    },
  });

  return { message: "Coupon redeemed successfully." };
};

// disable the existing coupon
export const disableCoupon = async (couponId: string) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) throw new Error("Coupon not found.");

  await prisma.coupon.update({
    where: { id: couponId },
    data: { expiryDate: new Date() },
  });

  return { message: "Coupon disabled successfully." };
};
// enable the existing coupon
export const enableCoupon = async (couponId: string, expirationDate: Date) => {
  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
  if (!coupon) throw new Error("Coupon not found.");

  await prisma.coupon.update({
    where: { id: couponId },
    data: { expiryDate: expirationDate },
  });

  return { message: "Coupon enabled successfully." };
};
