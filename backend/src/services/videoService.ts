import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listVideos = async () => {
  return prisma.video.findMany({
    where: { isApproved: true },
    omit: {
      url: true,
    },
  });
};

export const getVideoById = async (id: string) => {
  return prisma.video.findUnique({
    where: { id, isApproved: true },
    include: {
      category: {
        select: { id: true, name: true },
      },
      creator: {
        select: {
          id: true, // ← This is the line TypeScript is angry about
          name: true,
          logo: true,
        },
      },
    },
  });
};

export const submitVideo = async (
  videoData: {
    title: string;
    thumbnail: string;
    price: number;
    duration: string;
    categoryId: string;
    description: string;
    url?: string;
    isYoutubeUrl?: boolean;
    resolutions?: Record<string, string>; // Add resolutions field
  },
  userId: string,
  isAdmin: boolean
) => {
  return prisma.video.create({
    data: {
      title: videoData.title,
      thumbnail: videoData.thumbnail,
      price: videoData.price,
      duration: videoData.duration,
      category: { connect: { id: videoData.categoryId } },
      user: { connect: { id: userId } },
      url: videoData?.url,
      isYoutubeUrl: videoData?.isYoutubeUrl,
      isApproved: isAdmin,
      description: videoData.description,
      resolutions: videoData.resolutions || {}, // Store resolutions
    },
  });
};

export const approveVideo = async (id: string) => {
  return prisma.video.update({
    where: { id },
    data: { isApproved: true },
  });
};

export const isVideoPurchased = async (userId: string, videoId: string) => {
  const purchase = await prisma.purchase.findUnique({
    where: { userId_videoId: { userId, videoId } },
  });
  return !!purchase; // Return true if the video is purchased, otherwise false
};

export const getPaginatedVideos = async (
  page: number,
  limit: number,
  category?: string,
  priceType?: string
) => {
  const filters: any = { isApproved: true };

  // Add category filter if provided
  if (category) {
    filters.categoryId = category;
  }

  // Add price type filter if provided
  if (priceType) {
    if (priceType === "free") {
      filters.price = 0;
    } else if (priceType === "paid") {
      filters.price = { gt: 0 };
    }
  }

  const videos = await prisma.video.findMany({
    where: filters,
    skip: (page - 1) * limit,
    take: limit,
    omit: {
      url: true,
    },
    include: {
      category: {
        select: { id: true, name: true },
      },
    },
  });

  const total = await prisma.video.count({ where: filters });

  return { videos, total };
};

export const pendingVideoList = async () => {
  return prisma.video.findMany({ where: { isApproved: false } });
};

export const rejectVideo = (id: string, reason: string) => {
  return prisma.video.update({
    where: { id: id },
    data: {
      isApproved: false,
      rejectReason: reason,
    },
  });
};

export const relatedCategoryVideo = async (categoriesId: string) => {
  const categoriesName = await prisma.category.findFirst({
    where: { id: categoriesId },
    select: { name: true },
  });
  const videos = await prisma.video.findMany({
    where: {
      category: {
        name: {
          contains: categoriesName.name,
        },
      },
    },
  });
  return videos;
};
