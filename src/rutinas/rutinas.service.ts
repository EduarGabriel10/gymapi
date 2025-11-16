import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RutinasService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Crear una rutina personalizada
  async create(data: Prisma.RutinasCreateInput) {
    return this.prisma.rutinas.create({
      data,
      include: {
        cliente: { select: { nombre: true, apellido: true } },
        entrenador: { select: { nombre: true, apellido: true } },
      },
    });
  }

  // 🔹 Obtener todas las rutinas (opcional: filtrar por cliente o entrenador)
  async findAll(id_cliente?: number, id_entrenador?: number) {
    return this.prisma.rutinas.findMany({
      where: {
        ...(id_cliente && { id_cliente }),
        ...(id_entrenador && { id_entrenador }),
      },
      include: {
        cliente: { select: { nombre: true, apellido: true } },
        entrenador: { select: { nombre: true, apellido: true } },
      },
      orderBy: { fecha_asignacion: 'desc' },
    });
  }

  // 🔹 Obtener una rutina por ID
  async findOne(id_rutina: number) {
    const rutina = await this.prisma.rutinas.findUnique({
      where: { id_rutina },
      include: {
        cliente: { select: { nombre: true, apellido: true } },
        entrenador: { select: { nombre: true, apellido: true } },
      },
    });

    if (!rutina) throw new NotFoundException('Rutina no encontrada');
    return rutina;
  }

  // 🔹 Actualizar una rutina
  async update(id_rutina: number, data: Prisma.RutinasUpdateInput) {
    const rutina = await this.prisma.rutinas.findUnique({ where: { id_rutina } });
    if (!rutina) throw new NotFoundException('Rutina no encontrada');

    return this.prisma.rutinas.update({
      where: { id_rutina },
      data,
      include: {
        cliente: { select: { nombre: true, apellido: true } },
        entrenador: { select: { nombre: true, apellido: true } },
      },
    });
  }

  // 🔹 Eliminar una rutina
  async remove(id_rutina: number) {
    const rutina = await this.prisma.rutinas.findUnique({ where: { id_rutina } });
    if (!rutina) throw new NotFoundException('Rutina no encontrada');

    return this.prisma.rutinas.delete({
      where: { id_rutina },
    });
  }

  // 🔹 Buscar rutinas activas por cliente (por ejemplo, del último mes)
  async findRecentByCliente(id_cliente: number) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30); // últimos 30 días

    return this.prisma.rutinas.findMany({
      where: {
        id_cliente,
        fecha_asignacion: { gte: fechaLimite },
      },
      include: {
        entrenador: { select: { nombre: true, apellido: true } },
      },
      orderBy: { fecha_asignacion: 'desc' },
    });
  }

  // 🔹 Obtener todas las rutinas de un entrenador con información de clientes
  async findByEntrenador(id_entrenador: number) {
    return this.prisma.rutinas.findMany({
      where: { id_entrenador },
      include: {
        cliente: { select: { nombre: true, apellido: true } },
      },
      orderBy: { fecha_asignacion: 'desc' },
    });
  }

  // 🔹 Asignar una rutina desde un entrenador a un cliente (atajo)
  async asignarRutina(
    id_entrenador: number,
    id_cliente: number,
    nivel: string,
    descripcion: string,
  ) {
    const entrenador = await this.prisma.entrenadores.findUnique({ where: { id_entrenador } });
    const cliente = await this.prisma.clientes.findUnique({ where: { id_cliente } });

    if (!entrenador) throw new NotFoundException('Entrenador no encontrado');
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    return this.prisma.rutinas.create({
      data: {
        id_entrenador,
        id_cliente,
        nivel,
        descripcion,
        fecha_asignacion: new Date(),
      },
    });
  }

  async obtenerRutinasPorCliente(id_cliente: number) {
  return this.prisma.rutinas.findMany({
    where: { id_cliente },
    include: {
      entrenador: { select: { nombre: true, apellido: true } },
    },
    orderBy: { fecha_asignacion: 'desc' },
  });
}

}
