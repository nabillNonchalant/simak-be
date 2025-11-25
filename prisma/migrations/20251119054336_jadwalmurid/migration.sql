-- AddForeignKey
ALTER TABLE "AbsensiMurid" ADD CONSTRAINT "AbsensiMurid_jadwalGuruId_fkey" FOREIGN KEY ("jadwalGuruId") REFERENCES "JadwalGuru"("id") ON DELETE CASCADE ON UPDATE CASCADE;
