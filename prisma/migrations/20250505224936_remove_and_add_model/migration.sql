-- CreateTable
CREATE TABLE "websiteData" (
    "id" TEXT NOT NULL,
    "banner" TEXT,
    "about" TEXT,
    "aboutImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "websiteData_pkey" PRIMARY KEY ("id")
);
