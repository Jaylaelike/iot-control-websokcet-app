/*
  Warnings:

  - You are about to drop the `UserDevice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserDevice" DROP CONSTRAINT "UserDevice_deviceId_fkey";

-- DropForeignKey
ALTER TABLE "UserDevice" DROP CONSTRAINT "UserDevice_userId_fkey";

-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserDevice";

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
