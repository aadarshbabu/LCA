import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addMoneyToWallet = async (userId: string, amount: number) => {
  if (amount <= 0) throw new Error("Amount must be greater than zero.");

  const wallet = await prisma.wallet.upsert({
    where: { userId },
    update: { balance: { increment: amount } },
    create: { userId, balance: amount },
  });

  return wallet;
};

export const initializeWallet = async (userId: string, amount: number) => {
  if (amount !== 0) throw new Error("Amount must be greater than zero.");

  const wallet = await prisma.wallet.upsert({
    where: { userId },
    update: { balance: { increment: amount } },
    create: { userId, balance: amount },
  });

  return wallet;
};

export const purchaseVideo = async (userId: string, videoId: string) => {
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video) throw new Error("Video not found.");
  if (video.price <= 0) throw new Error("This video is free.");

  // Check if the user has already purchased the video
  const purchase = await prisma.purchase.findUnique({
    where: { userId_videoId: { userId, videoId } },
  });
  if (purchase) {
    return { message: "You have already purchased this video." };
  }

  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet || wallet.balance < video.price) {
    throw new Error("Insufficient balance in wallet.");
  }

  // Deduct the price from the wallet
  await prisma.wallet.update({
    where: { userId },
    data: { balance: { decrement: video.price } },
  });

  // Record the purchase
  await prisma.purchase.create({
    data: { userId, videoId },
  });

  return { message: "Video purchased successfully." };
};
