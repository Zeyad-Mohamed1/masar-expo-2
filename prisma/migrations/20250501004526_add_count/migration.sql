-- AlterTable
ALTER TABLE "Developer" ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Developer_zoomId_idx" ON "Developer"("zoomId");
