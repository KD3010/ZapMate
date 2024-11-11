/*
  Warnings:

  - You are about to drop the column `metadata` on the `Zap` table. All the data in the column will be lost.
  - Added the required column `metadata` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `AvailableActions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `AvailableTriggers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `Trigger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `metadata` to the `ZapRun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "metadata" JSONB NOT NULL,
ADD COLUMN     "sortingOrder" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "AvailableActions" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AvailableTriggers" ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "metadata" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Zap" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "ZapRun" ADD COLUMN     "metadata" JSONB NOT NULL;
