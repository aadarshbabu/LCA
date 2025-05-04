import { Request, Response } from "express";
import {
  disableCoupon,
  enableCoupon,
  validateCoupon,
} from "../services/couponService";
import { createCouponService } from "../services/couponService";

export const checkCouponValidity = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { code, amount } = req.body;
    if (!userId) throw new Error("User not authenticated.");

    const { discount, coupon } = await validateCoupon(code, amount, userId);
    res.status(200).json({ valid: true, discount, coupon });
  } catch (error) {
    res.status(400).json({ valid: false, error: error.message });
  }
};

export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, discount, expirationDate } = req.body;
    const isAdmin = req.user?.isAdmin;
    if (!isAdmin) throw new Error("User not authorized.");
    if (!code || !discount || !expirationDate) {
      throw new Error("All fields are required.");
    }
    if (discount <= 0) {
      throw new Error("Discount must be greater than zero.");
    }
    if (new Date(expirationDate) <= new Date()) {
      throw new Error("Expiration date must be in the future.");
    }

    const newCoupon = await createCouponService({
      code,
      discount,
      expirationDate,
    });
    res.status(201).json({ success: true, data: newCoupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// disable coupon
export const disableCouponCode = async (req: Request, res: Response) => {
  try {
    const { couponId } = req.params;
    const isAdmin = req.user?.isAdmin;
    if (!isAdmin) throw new Error("User not authorized.");

    if (!couponId) {
      throw new Error("Coupon ID is required.");
    }

    const coupon = await disableCoupon(couponId);
    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// enable coupon code

export const enableCouponCode = async (req: Request, res: Response) => {
  try {
    const { couponId } = req.params;
    const { expirationDate } = req.query;
    const isAdmin = req.user?.isAdmin;
    if (!expirationDate) {
      throw new Error("Expiration date is required.");
    }

    if (typeof expirationDate !== "string") {
      throw new Error("Expiration date must be a string.");
    }

    if (!isAdmin) throw new Error("User not authorized.");

    if (!couponId) {
      throw new Error("Coupon ID is required.");
    }
    if (new Date(expirationDate) <= new Date()) {
      throw new Error("Expiration date must be in the future.");
    }

    if (!expirationDate) {
      throw new Error("Expiration date is required.");
    }

    const coupon = await enableCoupon(couponId, new Date(expirationDate));

    if (!coupon) {
      throw new Error("Coupon not found.");
    }

    res.status(200).json({ success: true, data: coupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
