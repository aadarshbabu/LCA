import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCreator = async (userId: string) => {
  const creator = await prisma.creator.findFirst({
    where: { userId },
  });
  return creator;
};

export const createVideo = async (data: any, creatorId: string) => {
  const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
  if (!creator) {
    throw new Error("Creator not found.");
  }

  return await prisma.video.create({
    data: {
      ...data,
      creatorId: creator.id, // Use the creator's ID
    },
  });
};

export const editVideo = async (
  videoId: string,
  data: any,
  creatorId: string
) => {
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video || video.creatorId !== creatorId) {
    throw new Error("Video not found or unauthorized access.");
  }

  return await prisma.video.update({
    where: { id: videoId },
    data,
  });
};

export const deleteVideo = async (videoId: string, creatorId: string) => {
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video || video.creatorId !== creatorId) {
    throw new Error("Video not found or unauthorized access.");
  }

  await prisma.video.delete({ where: { id: videoId } });
};

export const getVideoAnalytics = async (videoId: string, userId: string) => {
  const video = await prisma.video.findUnique({ where: { id: videoId } });
  if (!video || video.creatorId !== userId) {
    throw new Error("Video not found or unauthorized access.");
  }

  return {
    views: video.views,
  };
};

export const getOverallAnalytics = async (userId: string) => {
  const videos = await prisma.video.findMany({ where: { creatorId: userId } });

  const totalViews = videos.reduce((sum, video) => sum + video.views, 0);

  return {
    totalVideos: videos.length,
    totalViews,
  };
};

export const removeCreator = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { isCreator: false },
  });
};

export const onboardCreator = async (
  userId: string,
  name: string,
  email: string
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error("User not found.");
  }

  if (user.isCreator) {
    throw new Error("User is already a creator.");
  }

  // Create a new creator entry
  const creator = await prisma.creator.create({
    data: {
      name,
      email,
      description: "Default description", // Provide a default description
      logo: "default-logo-url", // Provide a default logo URL
      user: { connect: { id: user.id } },
    },
  });

  // Update the user to mark them as a creator
  await prisma.user.update({
    where: { id: userId },
    data: { isCreator: true },
  });

  return creator;
};
