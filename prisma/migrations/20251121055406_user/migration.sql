-- AlterTable
ALTER TABLE "User" ADD COLUMN     "classId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_classId_fkey" FOREIGN KEY ("classId") REFERENCES "MasterClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;
