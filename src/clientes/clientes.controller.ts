import {Controller, Get, Post, Patch, Delete, Param, Body,} from '@nestjs/common';
import { ClientesService } from './clientes.service';
import { Prisma } from '@prisma/client';

@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  // ➕ Crear cliente
  @Post()
  create(@Body() data: Prisma.ClientesCreateInput) {
    return this.clientesService.create(data);
  }

  // 📋 Obtener todos los clientes
  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  // 🔍 Obtener cliente por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientesService.findOne(+id);
  }

  // ✏️ Actualizar datos del cliente
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.ClientesUpdateInput) {
    return this.clientesService.update(+id, data);
  }

  // 🗑️ Eliminar cliente
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientesService.remove(+id);
  }

  // 🧑‍🏫 Ver entrenador asignado
  // GET /clientes/5/entrenador
  @Get(':id/entrenador')
  getEntrenador(@Param('id') id: string) {
    return this.clientesService.getEntrenador(+id);
  }

  // 🔄 Cambiar entrenador
  // PATCH /clientes/5/entrenador
  @Patch(':id/entrenador')
  cambiarEntrenador(
    @Param('id') id: string,
    @Body('id_entrenador') id_entrenador: number,
  ) {
    return this.clientesService.cambiarEntrenador(+id, id_entrenador);
  }

  // 🕒 Registrar asistencia
  // POST /clientes/5/asistencia
  @Post(':id/asistencia')
  registrarAsistencia(@Param('id') id: string) {
    return this.clientesService.registrarAsistencia(+id);
  }

  // 📅 Ver historial de asistencias
  // GET /clientes/5/asistencias
  @Get(':id/asistencias')
  verAsistencias(@Param('id') id: string) {
    return this.clientesService.verAsistencias(+id);
  }

  // 💳 Registrar pago (y actualizar membresía)
  // POST /clientes/5/pagos
  @Post(':id/pagos')
  registrarPago(
    @Param('id') id: string,
    @Body('id_membresia') id_membresia: number,
    @Body('monto') monto: number,
  ) {
    return this.clientesService.registrarPago(+id, id_membresia, monto);
  }

  // 📆 Ver estado de membresía
  // GET /clientes/5/membresia
  @Get(':id/membresia')
  estadoMembresia(@Param('id') id: string) {
    return this.clientesService.estadoMembresia(+id);
  }

  // 🏋️‍♀️ Ver rutinas asignadas al cliente
  // GET /clientes/5/rutinas
  @Get(':id/rutinas')
  verRutinas(@Param('id') id: string) {
    return this.clientesService.verRutinas(+id);
  }
}
