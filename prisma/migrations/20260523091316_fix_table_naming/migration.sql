/*
  Warnings:

  - You are about to drop the `Dispute` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Dispute";

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "Pago" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "formaDePago" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT,
    "monto" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disputa" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "fechaDeInicio" TIMESTAMP(3) NOT NULL,
    "fechaDeFinalizacion" TIMESTAMP(3),
    "estado" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Disputa_pkey" PRIMARY KEY ("id")
);
