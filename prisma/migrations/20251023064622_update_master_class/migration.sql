/*
  Warnings:

  - You are about to drop the column `grup` on the `JadwalGuru` table. All the data in the column will be lost.
  - You are about to drop the column `kelas` on the `JadwalGuru` table. All the data in the column will be lost.
  - You are about to drop the `JadwalMurid` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `classId` to the `JadwalGuru` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AbsensiMurid" DROP CONSTRAINT "AbsensiMurid_jadwalGuruId_fkey";

-- DropForeignKey
ALTER TABLE "JadwalMurid" DROP CONSTRAINT "JadwalMurid_jadwalGuruId_fkey";

-- DropForeignKey
ALTER TABLE "JadwalMurid" DROP CONSTRAINT "JadwalMurid_muridId_fkey";

-- AlterTable
ALTER TABLE "JadwalGuru" DROP COLUMN "grup",
DROP COLUMN "kelas",
ADD COLUMN     "classId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" TEXT;

-- DropTable
DROP TABLE "JadwalMurid";

-- AddForeignKey
ALTER TABLE "JadwalGuru" ADD CONSTRAINT "JadwalGuru_classId_fkey" FOREIGN KEY ("classId") REFERENCES "MasterClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
