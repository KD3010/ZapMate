/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Zap" ALTER COLUMN "name" SET DEFAULT 'Untitled';

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
