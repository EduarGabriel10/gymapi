import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { RegistrarseService } from './registrarse.service';

@Controller('registrarse')
export class RegistrarseController {
  constructor(private readonly registrarseService: RegistrarseService) {}

  // 🔹 Registro general (rol: Cliente)
  @Post('general')
  async registrarseGeneral(
    @Body()
    body: {
      username: string;
      password: string;
      nombre: string;
      apellido: string;
      cedula: string;
      telefono?: string;
      email?: string;
    },
  ) {
    try {
      const result = await this.registrarseService.registrarseGeneral(body);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 🔹 Crear nuevo ADMIN (solo admin)
  @Post('admin')
  async crearAdmin(
    @Body() body: { username: string; password: string },
  ) {
    try {
      const result = await this.registrarseService.crearAdmin(body);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 🔹 Crear nuevo ENTRENADOR (solo admin)
  @Post('entrenador')
  async crearEntrenador(
    @Body()
    body: {
      username: string;
      password: string;
      nombre: string;
      apellido: string;
      especialidad?: string;
      telefono?: string;
      email?: string;
    },
  ) {
    try {
      const result = await this.registrarseService.crearEntrenador(body);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // 🔹 Crear nuevo CLIENTE (solo admin)
  @Post('cliente')
  async crearCliente(
    @Body()
    body: {
      username: string;
      password: string;
      nombre: string;
      apellido: string;
      cedula: string;
      telefono?: string;
      email?: string;
      id_entrenador?: number;
    },
  ) {
    try {
      const result = await this.registrarseService.crearCliente(body);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  
}
