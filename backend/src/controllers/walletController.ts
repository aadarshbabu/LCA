import { Request, Response } from "express";
import { addMoneyToWallet, purchaseVideo } from "../services/walletService";

export const addMoney = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.isAdmin;
    if (!isAdmin) throw new Error("User not authorized.");

    const { amount } = req.body;
    if (!userId) throw new Error("User not authenticated.");

    const wallet = await addMoneyToWallet(userId, amount);
    res.status(200).json(wallet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const buyVideo = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { videoId } = req.body;
    if (!userId) throw new Error("User not authenticated.");

    const result = await purchaseVideo(userId, videoId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
