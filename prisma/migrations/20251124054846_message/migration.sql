/*
  Warnings:

  - Added the required column `message` to the `NotificationUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationUser" ADD COLUMN     "message" TEXT NOT NULL;
