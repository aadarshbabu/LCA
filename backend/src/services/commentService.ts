import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Add a comment to a video
export const addCommentToVideo = async (
  content: string,
  videoId: string,
  userId: string
) => {
  try {
    return await prisma.comment.create({
      data: {
        content,
        videoId,
        userId,
      },
    });
  } catch (error) {
    throw new Error("Failed to add comment");
  }
};

// Reply to a comment
export const replyComment = async ({
  content,
  videoId,
  userId,
  parentId,
}: {
  content: string;
  videoId: string;
  userId: string;
  parentId: string;
}) => {
  try {
    return await prisma.comment.create({
      data: {
        content,
        videoId,
        userId,
        parentId,
      },
    });
  } catch (error) {
    throw new Error("Failed to reply to comment");
  }
};

// Get comments for a video
export const getVideoComments = async (videoId: string) => {
  try {
    const replies = await prisma.comment.findMany({
      where: { videoId, parentId: null },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profilePictureUrl: true,
              },
            },
          },
        },
      },
    });

    // cache the result in last 1 h and then
  } catch (error) {
    throw new Error("Failed to fetch comments");
  }
};
