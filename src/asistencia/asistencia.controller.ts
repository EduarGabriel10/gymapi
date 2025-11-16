import { Controller, Post, Get, Delete, Param } from '@nestjs/common';
import { AsistenciaService } from './asistencia.service';

@Controller('asistencia')
export class AsistenciaController {
  constructor(private readonly asistenciaService: AsistenciaService) {}

  // Registrar asistencia de un cliente
  @Post('registrar/:id_cliente')
  registrar(@Param('id_cliente') id_cliente: string) {
    return this.asistenciaService.registrarAsistencia(Number(id_cliente));
  }

  // Obtener todas las asistencias
  @Get()
  obtenerTodas() {
    return this.asistenciaService.obtenerTodas();
  }

  // Obtener asistencias por cliente
  @Get('cliente/:id_cliente')
  obtenerPorCliente(@Param('id_cliente') id_cliente: string) {
    return this.asistenciaService.obtenerPorCliente(Number(id_cliente));
  }

  // Eliminar asistencia
  @Delete(':id_asistencia')
  eliminar(@Param('id_asistencia') id_asistencia: string) {
    return this.asistenciaService.eliminarAsistencia(Number(id_asistencia));
  }

}
