import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Obtener todos los usuarios con su rol y si son entrenador o cliente
  async obtenerUsuarios() {
    return await this.prisma.usuarios.findMany({
      include: {
        rol: true,
        Entrenadores: true,
        Clientes: true
      }
    });
  }

  // Obtener datos completos de un usuario
  async obtenerUsuarioPorId(id_usuario: number) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario },
      include: {
        rol: true,
        Entrenadores: {
          include: {
            Clientes: true,
            Rutinas: true,
            Horarios_Entrenadores: true
          }
        },
        Clientes: {
          include: {
            Pagos: true,
            Asistencia: true,
            Rutinas: true
          }
        }
      }
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    return usuario;
  }

  // Eliminar usuario y todo su contenido
  async eliminarUsuario(id_usuario: number) {
    const usuario = await this.prisma.usuarios.findUnique({
      where: { id_usuario },
      include: {
        Entrenadores: true,
        Clientes: true
      }
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    // ============================================
    // SI ES ENTRENADOR
    // ============================================
    if (usuario.Entrenadores.length > 0) {
      const entrenador = usuario.Entrenadores[0];

      // Borrar horarios del entrenador
      await this.prisma.horarios_Entrenadores.deleteMany({
        where: { id_entrenador: entrenador.id_entrenador }
      });

      // Borrar rutinas hechas por el entrenador
      await this.prisma.rutinas.deleteMany({
        where: { id_entrenador: entrenador.id_entrenador }
      });

      // Quitar entrenador de clientes sin borrarlos
      await this.prisma.clientes.updateMany({
        where: { id_entrenador: entrenador.id_entrenador },
        data: { id_entrenador: null }
      });

      // Eliminar el entrenador
      await this.prisma.entrenadores.delete({
        where: { id_entrenador: entrenador.id_entrenador }
      });
    }

    // ============================================
    // SI ES CLIENTE
    // ============================================
    if (usuario.Clientes.length > 0) {
      const cliente = usuario.Clientes[0];

      // Borrar asistencias
      await this.prisma.asistencia.deleteMany({
        where: { id_cliente: cliente.id_cliente }
      });

      // Borrar pagos
      await this.prisma.pagos.deleteMany({
        where: { id_cliente: cliente.id_cliente }
      });

      // Borrar rutinas asignadas
      await this.prisma.rutinas.deleteMany({
        where: { id_cliente: cliente.id_cliente }
      });

      // Eliminar cliente
      await this.prisma.clientes.delete({
        where: { id_cliente: cliente.id_cliente }
      });
    }

    // ============================================
    // Eliminar el USUARIO final
    // ============================================
    return await this.prisma.usuarios.delete({
      where: { id_usuario }
    });
  }

  // Cambiar contraseña
async editarPassword(id_usuario: number, nuevaPassword: string) {
  const usuario = await this.prisma.usuarios.findUnique({
    where: { id_usuario }
  });

  if (!usuario) throw new NotFoundException('Usuario no encontrado');

  const passwordHash = await bcrypt.hash(nuevaPassword, 10);

  return await this.prisma.usuarios.update({
    where: { id_usuario },
    data: { password: passwordHash }
  });
}


  async obtenerReporteGeneral() {
  const usuarios = await this.prisma.usuarios.findMany({
    include: {
      rol: true,
      Entrenadores: true,
      Clientes: true
    }
  });

  const entrenadores = await this.prisma.entrenadores.findMany({
    include: {
      Clientes: true,
      Rutinas: true,
      Horarios_Entrenadores: true
    }
  });

  const clientes = await this.prisma.clientes.findMany({
    include: {
      entrenador: true,
      Pagos: {
        include: {
          membresia: true
        }
      },
      Asistencia: true,
      Rutinas: {
        include: {
          entrenador: true
        }
      }
    }
  });

  const pagos = await this.prisma.pagos.findMany({
    include: {
      cliente: true,
      membresia: true
    },
    orderBy: { fecha_pago: 'desc' }
  });

  const asistencias = await this.prisma.asistencia.findMany({
    include: {
      cliente: true
    },
    orderBy: { fecha: 'desc' }
  });

  const rutinas = await this.prisma.rutinas.findMany({
    include: {
      cliente: true,
      entrenador: true
    }
  });

  const membresias = await this.prisma.membresias.findMany();

  const horarios = await this.prisma.horarios_Entrenadores.findMany({
    include: {
      entrenador: true
    }
  });

  return {
    fecha_generado: new Date(),
    resumen: {
      total_usuarios: usuarios.length,
      total_entrenadores: entrenadores.length,
      total_clientes: clientes.length,
      total_pagos: pagos.length,
      total_asistencias: asistencias.length,
      total_rutinas: rutinas.length,
      total_membresias: membresias.length
    },
    usuarios,
    entrenadores,
    clientes,
    pagos,
    asistencias,
    rutinas,
    membresias,
    horarios
  };
}

}
