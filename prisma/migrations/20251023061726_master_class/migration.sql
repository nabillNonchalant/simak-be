/*
  Warnings:

  - You are about to drop the column `document` on the `AbsensiMurid` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AbsensiMurid" DROP COLUMN "document";

-- CreateTable
CREATE TABLE "MasterClass" (
    "id" SERIAL NOT NULL,
    "grup" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "MasterClass_pkey" PRIMARY KEY ("id")
);
