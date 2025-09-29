-- CreateEnum
CREATE TYPE "StatusAbsensi" AS ENUM ('HADIR', 'IZIN', 'SAKIT', 'ALFA');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RoleType" ADD VALUE 'GURU';
ALTER TYPE "RoleType" ADD VALUE 'KEPALA_SEKOLAH';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nipNisn" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'menunggu';

-- CreateTable
CREATE TABLE "JadwalGuru" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tahunAjaran" TEXT,
    "mataPelajaran" TEXT,
    "kelas" TEXT,
    "grup" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "JadwalGuru_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JadwalMurid" (
    "id" SERIAL NOT NULL,
    "muridId" INTEGER NOT NULL,
    "jadwalGuruId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "JadwalMurid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbsensiGuru" (
    "id" SERIAL NOT NULL,
    "jadwalGuruId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "StatusAbsensi" NOT NULL,
    "type" TEXT,
    "keterangan" TEXT,
    "document" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "AbsensiGuru_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "JadwalGuru" ADD CONSTRAINT "JadwalGuru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalMurid" ADD CONSTRAINT "JadwalMurid_muridId_fkey" FOREIGN KEY ("muridId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JadwalMurid" ADD CONSTRAINT "JadwalMurid_jadwalGuruId_fkey" FOREIGN KEY ("jadwalGuruId") REFERENCES "JadwalGuru"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsensiGuru" ADD CONSTRAINT "AbsensiGuru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsensiGuru" ADD CONSTRAINT "AbsensiGuru_jadwalGuruId_fkey" FOREIGN KEY ("jadwalGuruId") REFERENCES "JadwalGuru"("id") ON DELETE CASCADE ON UPDATE CASCADE;
