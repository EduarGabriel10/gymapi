import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { EntrenadorService } from './entrenador.service';
import { Prisma } from '@prisma/client';

@Controller('entrenador')
export class EntrenadorController {
  constructor(private readonly entrenadorService: EntrenadorService) {}

  // ➕ Crear entrenador
  @Post()
  async crearEntrenador(@Body() data: Prisma.EntrenadoresCreateInput) {
    return await this.entrenadorService.crearEntrenador(data);
  }

  // 📋 Ver todos los entrenadores
  @Get()
  async verTodos() {
    return await this.entrenadorService.verTodos();
  }

  // 🔍 Ver entrenador por ID
  @Get(':id_entrenador')
  async verPorId(@Param('id_entrenador', ParseIntPipe) id_entrenador: number) {
    return await this.entrenadorService.verPorId(id_entrenador);
  }

  // ✏️ Actualizar entrenador
  @Patch(':id_entrenador')
  async actualizarEntrenador(
    @Param('id_entrenador', ParseIntPipe) id_entrenador: number,
    @Body() data: Prisma.EntrenadoresUpdateInput,
  ) {
    return await this.entrenadorService.actualizarEntrenador(id_entrenador, data);
  }

  // 🗑️ Eliminar entrenador
  @Delete(':id_entrenador')
  async eliminarEntrenador(
    @Param('id_entrenador', ParseIntPipe) id_entrenador: number,
  ) {
    return await this.entrenadorService.eliminarEntrenador(id_entrenador);
  }

  // 👥 Ver todos los clientes de un entrenador
  @Get(':id_entrenador/clientes')
  async verClientesDeEntrenador(
    @Param('id_entrenador', ParseIntPipe) id_entrenador: number,
  ) {
    return await this.entrenadorService.verClientesDeEntrenador(id_entrenador);
  }

  // 🏋️ Ver rutinas asignadas por el entrenador
  @Get(':id_entrenador/rutinas')
  async verRutinasAsignadas(
    @Param('id_entrenador', ParseIntPipe) id_entrenador: number,
  ) {
    return await this.entrenadorService.verRutinasAsignadas(id_entrenador);
  }

  // 🕒 Ver horarios del entrenador
  @Get(':id_entrenador/horarios')
  async verHorarios(@Param('id_entrenador', ParseIntPipe) id_entrenador: number) {
    return await this.entrenadorService.verHorarios(id_entrenador);
  }

  // 🔗 Asignar entrenador a cliente
  @Post('asignar')
  async asignarEntrenadorACliente(
    @Body('id_entrenador', ParseIntPipe) id_entrenador: number,
    @Body('id_cliente', ParseIntPipe) id_cliente: number,
  ) {
    return await this.entrenadorService.asignarEntrenadorACliente(
      id_entrenador,
      id_cliente,
    );
  }

  // 🔓 Remover entrenador de cliente
@Delete('remover/:id_cliente')
async removerEntrenadorDeCliente(@Param('id_cliente', ParseIntPipe) id_cliente: number) {
  return this.entrenadorService.removerEntrenadorDeCliente(id_cliente);
}
}
