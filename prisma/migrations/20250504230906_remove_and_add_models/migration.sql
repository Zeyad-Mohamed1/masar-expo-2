/*
  Warnings:

  - You are about to drop the column `email` on the `Developer` table. All the data in the column will be lost.
  - You are about to drop the column `zoomId` on the `Developer` table. All the data in the column will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_developerId_fkey";

-- DropIndex
DROP INDEX "Developer_email_key";

-- DropIndex
DROP INDEX "Developer_zoomId_idx";

-- AlterTable
ALTER TABLE "Developer" DROP COLUMN "email",
DROP COLUMN "zoomId";

-- DropTable
DROP TABLE "Project";

-- CreateTable
CREATE TABLE "link" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_pkey" PRIMARY KEY ("id")
);
