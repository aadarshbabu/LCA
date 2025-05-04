import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { StorageProvider } from "../utils/storageProvider";

const prisma = new PrismaClient();

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  phone?: string,
  type?: string,
  profilePictureUrl?: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      type,
      profilePictureUrl,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    {
      id: user.id,
      isAdmin: user.isAdmin,
      email: user.email,
      type: user.type,
      isVerified: user.isVerified,
      profilePictureUrl: user.profilePictureUrl,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );
  return { user, token };
};

export const findOrCreateOAuthUser = async (
  provider: "google" | "github",
  providerId: string,
  email: string,
  firstName?: string,
  lastName?: string,
  profilePictureUrl?: string,
  type?: string
) => {
  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        [`${provider}Id`]: providerId,
        firstName,
        lastName,
        profilePictureUrl,
        type,
      },
    });

    return user;
  }

  if (!user[`${provider}Id`]) {
    user = await prisma.user.update({
      where: { email },
      data: { [`${provider}Id`]: providerId },
    });
  }

  return user;
};

export const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const getUserProfileService = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      profilePictureUrl: true,
      firstName: true,
      lastName: true,
      phone: true,
      type: true,
      isVerified: true,
      isAdmin: true,
      wallet: {
        select: {
          id: true,
          balance: true,
        },
      },
    },
  });
};

export const updateProfilePicture = async (
  userId: string,
  profilePicture: Express.Multer.File
) => {
  // user the StorageProvider to upload the file

  const provider = new StorageProvider();

  const fileUrl = await provider.upload(profilePicture);

  return prisma.user.update({
    where: { id: userId },
    data: { profilePictureUrl: fileUrl },
  });
};
