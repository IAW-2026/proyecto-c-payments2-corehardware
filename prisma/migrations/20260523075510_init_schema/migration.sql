-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "formaDePago" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT,
    "monto" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispute" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "pedidoId" TEXT NOT NULL,
    "fechaDeInicio" TIMESTAMP(3) NOT NULL,
    "fechaDeFinalizacion" TIMESTAMP(3),
    "estado" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "Dispute_pkey" PRIMARY KEY ("id")
);
