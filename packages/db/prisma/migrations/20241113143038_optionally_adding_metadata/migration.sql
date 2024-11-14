-- AlterTable
ALTER TABLE "Action" ALTER COLUMN "metadata" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trigger" ALTER COLUMN "metadata" DROP NOT NULL;
