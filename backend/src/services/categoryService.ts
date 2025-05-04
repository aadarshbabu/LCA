import { PrismaClient } from "@prisma/client";
import NodeCache from "node-cache";

const prisma = new PrismaClient();
const cache = new NodeCache({ stdTTL: 3600 }); // Cache TTL set to 1 hour

export const createCategory = async (
  name: string,
  isDefault: boolean,
  userId?: string
) => {
  return prisma.category.create({
    data: {
      name,
      isDefault,
      createdBy: userId || null,
    },
  });
};

export const getCategories = async (userId?: string) => {
  return prisma.category.findMany({
    where: {
      OR: [{ isDefault: true }, { createdBy: userId }],
    },
  });
};

export const getCategoriesWithVideoCount = async () => {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: { videos: true },
      },
    },
  });
};

export const getPopularCategories = async () => {
  const cacheKey = "popularCategories";
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const popularCategories = await prisma.category.findMany({
    take: 10,
    orderBy: {
      videos: {
        _count: "desc",
      },
    },
    include: {
      _count: {
        select: { videos: true },
      },
      videos: {
        select: {
          views: true,
        },
      },
    },
  });

  const formattedCategories = popularCategories.map((category) => {
    const totalViews = category.videos.reduce(
      (sum, video) => sum + video.views,
      0
    );
    return {
      id: category.id,
      name: category.name,
      totalViews,
      videoCount: category._count.videos,
    };
  });

  cache.set(cacheKey, formattedCategories);
  return formattedCategories;
};
