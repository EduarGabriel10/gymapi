import { Controller, Get, Param, Delete, Patch, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}


  // Ver todos los usuarios
  @Get('usuarios')
  obtener() {
    return this.adminService.obtenerUsuarios();
  }

  // Ver información completa de un usuario
  @Get('usuario/:id')
  usuarioById(@Param('id') id: number) {
    return this.adminService.obtenerUsuarioPorId(Number(id));
  }

  // Eliminar un usuario + todo lo relacionado
  @Delete('usuario/:id')
  eliminar(@Param('id') id: number) {
    return this.adminService.eliminarUsuario(Number(id));
  }

  // Cambiar contraseña de un usuario
  @Patch('usuario/:id/password')
  cambiarPassword(
    @Param('id') id: number,
    @Body('password') password: string
  ) {
    return this.adminService.editarPassword(Number(id), password);
  }

  // Generar reporte general
  @Get('reportegeneral')
  reporteGeneral() {
    return this.adminService.obtenerReporteGeneral();
  }
}
