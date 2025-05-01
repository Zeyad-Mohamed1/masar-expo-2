/*
  Warnings:

  - You are about to drop the column `description` on the `Developer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Developer" DROP COLUMN "description",
ADD COLUMN     "longDescription" TEXT,
ADD COLUMN     "shortDescription" TEXT;
