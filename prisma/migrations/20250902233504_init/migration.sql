/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TipoCobro" AS ENUM ('DIARIO', 'SEMANAL', 'MENSUAL');

-- CreateEnum
CREATE TYPE "public"."EstadoPrestamo" AS ENUM ('PENDIENTE', 'ACTIVO', 'CANCELADO', 'MOROSO');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "public"."Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT,
    "direccion" TEXT NOT NULL,
    "cedulaFotoUrl" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prestamo" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "interes" DOUBLE PRECISION NOT NULL,
    "tipoCobro" "public"."TipoCobro" NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "estado" "public"."EstadoPrestamo" NOT NULL DEFAULT 'PENDIENTE',

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Trabajador" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telefono" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trabajador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cobro" (
    "id" SERIAL NOT NULL,
    "prestamoId" INTEGER NOT NULL,
    "trabajadorId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montoPagado" DOUBLE PRECISION NOT NULL,
    "evidenciaUrl" TEXT,

    CONSTRAINT "Cobro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "public"."Cliente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_username_key" ON "public"."Cliente"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Trabajador_email_key" ON "public"."Trabajador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Trabajador_username_key" ON "public"."Trabajador"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "public"."Admin"("username");

-- AddForeignKey
ALTER TABLE "public"."Prestamo" ADD CONSTRAINT "Prestamo_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cobro" ADD CONSTRAINT "Cobro_prestamoId_fkey" FOREIGN KEY ("prestamoId") REFERENCES "public"."Prestamo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Cobro" ADD CONSTRAINT "Cobro_trabajadorId_fkey" FOREIGN KEY ("trabajadorId") REFERENCES "public"."Trabajador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
