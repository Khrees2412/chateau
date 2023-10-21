/*
  Warnings:

  - Added the required column `type` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Made the column `roomId` on table `Message` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `participantLimit` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" VARCHAR(10) NOT NULL,
ALTER COLUMN "roomId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "participantLimit" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
