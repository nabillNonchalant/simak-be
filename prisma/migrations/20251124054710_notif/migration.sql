/*
  Warnings:

  - You are about to drop the column `message` on the `NotificationUser` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `NotificationUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "NotificationUser" DROP COLUMN "message",
DROP COLUMN "title";
