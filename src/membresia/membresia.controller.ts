import {Controller,Get,Post,Patch,Delete,Param,Body,
} from '@nestjs/common';
import { MembresiaService } from './membresia.service';
import { Prisma } from '@prisma/client';

@Controller('membresias')
export class MembresiaController {
  constructor(private readonly membresiaService: MembresiaService) {}

  // ➕ Crear membresía
  @Post()
  crear(@Body() data: Prisma.MembresiasCreateInput) {
    return this.membresiaService.crearMembresia(data);
  }

  // 📋 Ver todas las membresías
  @Get()
  verTodas() {
    return this.membresiaService.verTodasMembresias();
  }

  // 🔍 Ver una membresía por ID
  @Get(':id')
  verUna(@Param('id') id: string) {
    return this.membresiaService.verMembresia(+id);
  }

  // ✏️ Actualizar membresía
  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() data: Prisma.MembresiasUpdateInput,
  ) {
    return this.membresiaService.actualizarMembresia(+id, data);
  }

  // 🗑️ Eliminar membresía
  @Delete(':id')
  eliminar(@Param('id') id: string) {
    return this.membresiaService.eliminarMembresia(+id);
  }

  // 💳 Registrar pago (cliente compra una membresía)
  @Post('pago')
  registrarPago(
    @Body('id_cliente') id_cliente: number,
    @Body('id_membresia') id_membresia: number,
    @Body('monto') monto: number,
  ) {
    return this.membresiaService.registrarPago(
      id_cliente,
      id_membresia,
      monto,
    );
  }

  // 🧾 Ver historial de pagos del cliente
  @Get('pagos/:id_cliente')
  historialPagos(@Param('id_cliente') id_cliente: string) {
    return this.membresiaService.historialPagos(+id_cliente);
  }

  // 🧠 Estado actual de la membresía del cliente
  @Get('estado/:id_cliente')
  estadoActual(@Param('id_cliente') id_cliente: string) {
    return this.membresiaService.estadoActual(+id_cliente);
  }
}
