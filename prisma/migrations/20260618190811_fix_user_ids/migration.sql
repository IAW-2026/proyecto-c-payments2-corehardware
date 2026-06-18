/*
  Warnings:

  - Added the required column `buyerId` to the `Pago` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerId` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pago" ADD COLUMN     "buyerId" TEXT NOT NULL,
ADD COLUMN     "sellerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Disputa" ADD CONSTRAINT "Disputa_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "Pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
