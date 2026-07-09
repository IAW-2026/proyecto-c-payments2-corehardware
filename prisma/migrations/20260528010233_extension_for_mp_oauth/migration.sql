/*
  Warnings:

  - You are about to drop the column `pedidoId` on the `Disputa` table. All the data in the column will be lost.
  - You are about to drop the column `clerkUserId` on the `Pago` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerkUserId]` on the table `Disputa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[buyerClerkUserId]` on the table `Pago` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sellerClerkUserId]` on the table `Pago` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pagoId` to the `Disputa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyerClerkUserId` to the `Pago` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sellerClerkUserId` to the `Pago` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Disputa" DROP COLUMN "pedidoId",
ADD COLUMN     "pagoId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Pago" DROP COLUMN "clerkUserId",
ADD COLUMN     "buyerClerkUserId" TEXT NOT NULL,
ADD COLUMN     "sellerClerkUserId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CredencialVendedor" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "vendedorId" TEXT NOT NULL,
    "mercadoPagoUserId" BIGINT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "publicKey" TEXT,
    "expiresIn" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CredencialVendedor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CredencialVendedor_clerkUserId_key" ON "CredencialVendedor"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "CredencialVendedor_vendedorId_key" ON "CredencialVendedor"("vendedorId");

-- CreateIndex
CREATE UNIQUE INDEX "CredencialVendedor_mercadoPagoUserId_key" ON "CredencialVendedor"("mercadoPagoUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Disputa_clerkUserId_key" ON "Disputa"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_buyerClerkUserId_key" ON "Pago"("buyerClerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_sellerClerkUserId_key" ON "Pago"("sellerClerkUserId");
