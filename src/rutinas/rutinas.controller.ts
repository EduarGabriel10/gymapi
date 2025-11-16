import {Controller, Get, Post, Patch, Delete, Param, Body, Query,} from '@nestjs/common';
import { RutinasService } from './rutinas.service';

import { Prisma } from '@prisma/client';

@Controller('rutinas')
export class RutinasController {
  constructor(private readonly rutinasService: RutinasService) {}

  // ➕ Crear una rutina personalizada
  @Post()
  create(@Body() data: Prisma.RutinasCreateInput) {
    return this.rutinasService.create(data);
  }

  // 📋 Obtener todas las rutinas (puedes filtrar por cliente o entrenador)
  // Ejemplo: GET /rutinas?id_cliente=1  o  GET /rutinas?id_entrenador=2
  @Get()
  findAll(
    @Query('id_cliente') id_cliente?: string,
    @Query('id_entrenador') id_entrenador?: string,
  ) {
    return this.rutinasService.findAll(
      id_cliente ? Number(id_cliente) : undefined,
      id_entrenador ? Number(id_entrenador) : undefined,
    );
  }

  // 🔍 Obtener una rutina por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rutinasService.findOne(+id);
  }

  // ✏️ Actualizar una rutina
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.RutinasUpdateInput) {
    return this.rutinasService.update(+id, data);
  }

  // 🗑️ Eliminar una rutina
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rutinasService.remove(+id);
  }

  // 📅 Buscar rutinas recientes del cliente (últimos 30 días)
  // Ejemplo: GET /rutinas/recientes?id_cliente=1
  @Get('recientes')
  findRecentByCliente(@Query('id_cliente') id_cliente: string) {
    return this.rutinasService.findRecentByCliente(+id_cliente);
  }

  // 🧑‍🏫 Obtener todas las rutinas de un entrenador con info de clientes
  // Ejemplo: GET /rutinas/entrenador/1
  @Get('entrenador/:id_entrenador')
  findByEntrenador(@Param('id_entrenador') id_entrenador: string) {
    return this.rutinasService.findByEntrenador(+id_entrenador);
  }

  // 🏋️‍♂️ Asignar rutina personalizada (atajo directo)
  // Ejemplo: POST /rutinas/asignar
  // {
  //   "id_entrenador": 1,
  //   "id_cliente": 2,
  //   "nivel": "Intermedio",
  //   "descripcion": "Rutina de fuerza para tren superior"
  // }
  @Post('asignar')
  asignarRutina(
    @Body('id_entrenador') id_entrenador: number,
    @Body('id_cliente') id_cliente: number,
    @Body('nivel') nivel: string,
    @Body('descripcion') descripcion: string,
  ) {
    return this.rutinasService.asignarRutina(
      id_entrenador,
      id_cliente,
      nivel,
      descripcion,
    );
  }

  // 🏋️‍♀️ Obtener todas las rutinas de un cliente con info de entrenadores
  // Ejemplo: GET /rutinas/cliente/1
  @Get('cliente/:id_cliente')
  findByCliente(@Param('id_cliente') id_cliente: string) {
    return this.rutinasService.obtenerRutinasPorCliente(+id_cliente);
  }


}
