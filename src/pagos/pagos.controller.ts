import { Controller, Get, Param } from '@nestjs/common';
import { PagosService } from './pagos.service';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  // 🔹 1. Obtener todos los pagos
  @Get()
  obtenerPagos() {
    return this.pagosService.obtenerPagos();
  }

  // 🔹 2. Total recaudado por mes (GET /pagos/total-mes/2025/11)
  @Get('total-mes/:anio/:mes')
  totalPorMes(
    @Param('anio') anio: string,
    @Param('mes') mes: string
  ) {
    return this.pagosService.totalPorMes(Number(anio), Number(mes));
  }

  // 🔹 3. Total recaudado por año (GET /pagos/total-anio/2025)
  @Get('total-anio/:anio')
  totalPorAnio(@Param('anio') anio: string) {
    return this.pagosService.totalPorAnio(Number(anio));
  }

  // 🔹 4. Total recaudado por cada mes (GET /pagos/resumen-mensual/2025)
  @Get('resumen-mensual/:anio')
  resumenMensual(@Param('anio') anio: string) {
    return this.pagosService.resumenMensual(Number(anio));
  }

  // 🔹 5. Pagos de un cliente (GET /pagos/cliente/1)
  @Get('cliente/:id_cliente')
  pagosPorCliente(@Param('id_cliente') id_cliente: string) {
    return this.pagosService.pagosPorCliente(Number(id_cliente));
  }
}
