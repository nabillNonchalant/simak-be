-- CreateTable
CREATE TABLE "AbsensiMurid" (
    "id" SERIAL NOT NULL,
    "jadwalGuruId" INTEGER NOT NULL,
    "muridId" INTEGER NOT NULL,
    "status" "StatusAbsensi" NOT NULL,
    "type" TEXT,
    "keterangan" TEXT,
    "document" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "AbsensiMurid_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AbsensiMurid" ADD CONSTRAINT "AbsensiMurid_muridId_fkey" FOREIGN KEY ("muridId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsensiMurid" ADD CONSTRAINT "AbsensiMurid_jadwalGuruId_fkey" FOREIGN KEY ("jadwalGuruId") REFERENCES "JadwalMurid"("id") ON DELETE CASCADE ON UPDATE CASCADE;
