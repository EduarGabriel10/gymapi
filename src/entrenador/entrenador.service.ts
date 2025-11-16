import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EntrenadorService {
  constructor(private prisma: PrismaService) {}

  // ➕ Crear entrenador
async crearEntrenador(data: any) {
  return await this.prisma.entrenadores.create({
    data: {
      nombre: data.nombre,
      apellido: data.apellido,
      especialidad: data.especialidad,
      telefono: data.telefono,
      email: data.email,
      usuario: {
        create: {
          username: data.usuario.username,
          password: data.usuario.password, // recuerda hashear
          id_rol: data.usuario.id_rol
        }
      }
    }
  });
}


  // 📋 Ver todos los entrenadores
  async verTodos() {
    return await this.prisma.entrenadores.findMany({
      include: {
        usuario: true,
        Clientes: true,
        Horarios_Entrenadores: true,
      },
    });
  }

  // 🔍 Ver entrenador por ID
  async verPorId(id_entrenador: number) {
    const entrenador = await this.prisma.entrenadores.findUnique({
      where: { id_entrenador },
      include: {
        usuario: true,
        Clientes: true,
        Horarios_Entrenadores: true,
        Rutinas: {
          include: { cliente: true },
        },
      },
    });

    if (!entrenador) throw new NotFoundException('Entrenador no encontrado');
    return entrenador;
  }

  // ✏️ Actualizar entrenador
  async actualizarEntrenador(
    id_entrenador: number,
    data: Prisma.EntrenadoresUpdateInput,
  ) {
    const existe = await this.prisma.entrenadores.findUnique({
      where: { id_entrenador },
    });
    if (!existe) throw new NotFoundException('Entrenador no encontrado');

    return await this.prisma.entrenadores.update({
      where: { id_entrenador },
      data,
    });
  }

  // 🗑️ Eliminar entrenador
  async eliminarEntrenador(id_entrenador: number) {
    const existe = await this.prisma.entrenadores.findUnique({
      where: { id_entrenador },
    });
    if (!existe) throw new NotFoundException('Entrenador no encontrado');

    // Antes de eliminar, liberar clientes asociados
    await this.prisma.clientes.updateMany({
      where: { id_entrenador },
      data: { id_entrenador: null },
    });

    return await this.prisma.entrenadores.delete({
      where: { id_entrenador },
    });
  }

  // 👥 Ver todos los clientes de un entrenador
  async verClientesDeEntrenador(id_entrenador: number) {
    const entrenador = await this.prisma.entrenadores.findUnique({
      where: { id_entrenador },
      include: { Clientes: true },
    });
    if (!entrenador) throw new NotFoundException('Entrenador no encontrado');
    return entrenador.Clientes;
  }

  // 📅 Ver horarios del entrenador
  async verHorarios(id_entrenador: number) {
    return await this.prisma.horarios_Entrenadores.findMany({
      where: { id_entrenador },
    });
  }

  // 🏋️ Ver rutinas asignadas por el entrenador
  async verRutinasAsignadas(id_entrenador: number) {
    return await this.prisma.rutinas.findMany({
      where: { id_entrenador },
      include: {
        cliente: true,
      },
    });
  }

  // 🔗 Asignar un entrenador a un cliente
  async asignarEntrenadorACliente(id_entrenador: number, id_cliente: number) {
    const entrenador = await this.prisma.entrenadores.findUnique({
      where: { id_entrenador },
    });
    const cliente = await this.prisma.clientes.findUnique({
      where: { id_cliente },
    });

    if (!entrenador) throw new NotFoundException('Entrenador no encontrado');
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    if (cliente.id_entrenador === id_entrenador)
      throw new BadRequestException('El cliente ya tiene este entrenador asignado');

    return await this.prisma.clientes.update({
      where: { id_cliente },
      data: { id_entrenador },
    });
  }

  // 🔓 Remover entrenador de un cliente
async removerEntrenadorDeCliente(id_cliente: number) {
  // 1) Obtener cliente y su entrenador actual
  const cliente = await this.prisma.clientes.findUnique({
    where: { id_cliente },
    select: { id_entrenador: true },
  });
  if (!cliente) throw new NotFoundException('Cliente no encontrado');

  // 2) Desasignar entrenador del cliente
  const updated = await this.prisma.clientes.update({
    where: { id_cliente },
    data: { id_entrenador: null },
  });
  return updated;
}
}
