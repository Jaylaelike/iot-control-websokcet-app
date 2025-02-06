/*
  Warnings:

  - You are about to drop the `DeviceAccess` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DeviceAccess" DROP CONSTRAINT "DeviceAccess_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "DeviceAccess" DROP CONSTRAINT "DeviceAccess_userId_fkey";

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "DeviceAccess";
