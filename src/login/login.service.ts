import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginService {
  private prisma = new PrismaClient();

  async validateUser(username: string, password: string) {
    // Buscar el usuario
    const user = await this.prisma.usuarios.findUnique({
      where: { username },
      include: {
        rol: true,
        Entrenadores: true,
        Clientes: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    // Determinar el tipo de usuario
    let tipoUsuario = 'Desconocido';
    let datosPersona: any = {};

    if (user.rol.nombre.toLowerCase() === 'admin') {
      tipoUsuario = 'Administrador';
      datosPersona = { username: user.username };
    } else if (user.Entrenadores.length > 0) {
      tipoUsuario = 'Entrenador';
      const entrenador = user.Entrenadores[0];
      datosPersona = {
        id_entrenador: entrenador.id_entrenador,
        nombre: entrenador.nombre,
        apellido: entrenador.apellido,
        especialidad: entrenador.especialidad,
        telefono: entrenador.telefono,
        email: entrenador.email,
      };
    } else if (user.Clientes.length > 0) {
      tipoUsuario = 'Cliente';
      const cliente = user.Clientes[0];
      datosPersona = {
        id_cliente: cliente.id_cliente,
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        cedula: cliente.cedula,
        telefono: cliente.telefono,
        email: cliente.email,
        estado_membresia: cliente.estado_membresia,
      };
    }

    // Mostrar en consola los datos del usuario
    console.log('=== LOGIN EXITOSO ===');
    console.log(`Tipo: ${tipoUsuario}`);
    console.log('Datos:', datosPersona);

    // Retornar los datos al controlador
    return {
      message: 'Inicio de sesión exitoso',
      tipoUsuario,
      username: user.username,
      datosPersona,
    };
  }
}
