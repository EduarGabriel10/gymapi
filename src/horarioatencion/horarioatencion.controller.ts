import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { HorarioatencionService } from './horarioatencion.service';
import { Prisma } from '@prisma/client';

@Controller('horarioatencion')
export class HorarioatencionController {
  constructor(private readonly horarioatencionService: HorarioatencionService) {}

  // ➕ Crear horario
  @Post()
  create(@Body() data: Prisma.Horarios_EntrenadoresCreateInput) {
    return this.horarioatencionService.create(data);
  }

  // 📋 Listar todos los horarios (puedes pasar ?id_entrenador=1)
  @Get()
  findAll(@Query('id_entrenador') id_entrenador?: string) {
    return this.horarioatencionService.findAll(id_entrenador ? Number(id_entrenador) : undefined);
  }

  // 🔍 Obtener un horario específico
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horarioatencionService.findOne(+id);
  }

  // ✏️ Actualizar horario
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Prisma.Horarios_EntrenadoresUpdateInput) {
    return this.horarioatencionService.update(+id, data);
  }

  // 🗑️ Eliminar horario
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horarioatencionService.remove(+id);
  }
}
