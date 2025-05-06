/*
  Warnings:

  - You are about to drop the column `email` on the `Developer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Developer_email_key";

-- AlterTable
ALTER TABLE "Developer" DROP COLUMN "email";
