import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class HorarioatencionService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Crear un nuevo horario de atención
  async create(data: Prisma.Horarios_EntrenadoresCreateInput) {
    return this.prisma.horarios_Entrenadores.create({
      data,
    });
  }

  // 🔹 Obtener todos los horarios (opcionalmente filtrados por entrenador)
  async findAll(id_entrenador?: number) {
    return this.prisma.horarios_Entrenadores.findMany({
      where: id_entrenador ? { id_entrenador } : {},
      include: {
        entrenador: {
          select: { nombre: true, apellido: true, especialidad: true },
        },
      },
      orderBy: { id_horario: 'asc' },
    });
  }

  // 🔹 Obtener un horario por ID
  async findOne(id_horario: number) {
    const horario = await this.prisma.horarios_Entrenadores.findUnique({
      where: { id_horario },
      include: {
        entrenador: { select: { nombre: true, apellido: true } },
      },
    });
    if (!horario) throw new NotFoundException('Horario no encontrado');
    return horario;
  }

  // 🔹 Actualizar un horario existente
  async update(id_horario: number, data: Prisma.Horarios_EntrenadoresUpdateInput) {
    const horario = await this.prisma.horarios_Entrenadores.findUnique({ where: { id_horario } });
    if (!horario) throw new NotFoundException('Horario no encontrado');
    return this.prisma.horarios_Entrenadores.update({
      where: { id_horario },
      data,
    });
  }

  // 🔹 Eliminar un horario
  async remove(id_horario: number) {
    const horario = await this.prisma.horarios_Entrenadores.findUnique({ where: { id_horario } });
    if (!horario) throw new NotFoundException('Horario no encontrado');
    return this.prisma.horarios_Entrenadores.delete({
      where: { id_horario },
    });
  }
}
