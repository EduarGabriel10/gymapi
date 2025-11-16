import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AsistenciaService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ 1. Registrar una nueva asistencia
  async registrarAsistencia(id_cliente: number) {
    // Validar que el cliente exista
    const cliente = await this.prisma.clientes.findUnique({
      where: { id_cliente },
    });

    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id_cliente} no encontrado.`);
    }

    const fechaActual = new Date();
    const soloFecha = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      fechaActual.getDate()
    );

    // Evitar duplicar asistencia en el mismo día
    const existente = await this.prisma.asistencia.findFirst({
      where: {
        id_cliente,
        fecha: soloFecha,
      },
    });

    if (existente) {
      throw new BadRequestException('Ya se registró la asistencia para hoy.');
    }

    return this.prisma.asistencia.create({
      data: {
        id_cliente,
        fecha: soloFecha,
        hora: fechaActual,
      },
      include: {
        cliente: {
          select: { nombre: true, apellido: true },
        },
      },
    });
  }

  // ✅ 2. Obtener todas las asistencias (admin o entrenador)
  async obtenerTodas() {
    return this.prisma.asistencia.findMany({
      include: {
        cliente: {
          select: {
            id_cliente: true,
            nombre: true,
            apellido: true,
            cedula: true,
          },
        },
      },
      orderBy: { fecha: 'desc' },
    });
  }

  // ✅ 3. Obtener asistencias por cliente
  async obtenerPorCliente(id_cliente: number) {
    const cliente = await this.prisma.clientes.findUnique({
      where: { id_cliente },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado.');
    }

    return this.prisma.asistencia.findMany({
      where: { id_cliente },
      orderBy: { fecha: 'desc' },
    });
  }

  // ✅ 4. Eliminar una asistencia (por error o control administrativo)
  async eliminarAsistencia(id_asistencia: number) {
    const asistencia = await this.prisma.asistencia.findUnique({
      where: { id_asistencia },
    });

    if (!asistencia) {
      throw new NotFoundException('Asistencia no encontrada.');
    }

    await this.prisma.asistencia.delete({
      where: { id_asistencia },
    });

    return { message: 'Asistencia eliminada correctamente.' };
  }
}
