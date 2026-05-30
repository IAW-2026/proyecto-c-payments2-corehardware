/*
  Warnings:

  - A unique constraint covering the columns `[pedidoId]` on the table `Disputa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pagoId]` on the table `Disputa` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pedidoId` to the `Disputa` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Disputa_clerkUserId_key";

-- AlterTable
ALTER TABLE "Disputa" ADD COLUMN     "pedidoId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Disputa_pedidoId_key" ON "Disputa"("pedidoId");

-- CreateIndex
CREATE UNIQUE INDEX "Disputa_pagoId_key" ON "Disputa"("pagoId");
