/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Creator` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Creator_userId_key" ON "Creator"("userId");
