import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
