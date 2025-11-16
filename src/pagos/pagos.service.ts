import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PagosService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // 📌 1. Obtener todos los pagos
  // ============================================
  async obtenerPagos() {
    return await this.prisma.pagos.findMany({
      orderBy: { fecha_pago: 'desc' },
      include: {
        cliente: {
          select: { nombre: true, apellido: true, id_cliente: true }
        },
        membresia: {
          select: { tipo: true, precio: true }
        }
      }
    });
  }

  // ============================================
  // 📌 2. Total recaudado por mes (solo un mes)
  // ============================================
  async totalPorMes(anio: number, mes: number) {
    const inicio = new Date(anio, mes - 1, 1);
    const fin = new Date(anio, mes, 1);

    const pagos = await this.prisma.pagos.aggregate({
      _sum: { monto: true },
      where: {
        fecha_pago: {
          gte: inicio,
          lt: fin
        }
      }
    });

    return pagos._sum.monto || 0;
  }

  // ============================================
  // 📌 3. Total recaudado en un año
  // ============================================
  async totalPorAnio(anio: number) {
    const inicio = new Date(anio, 0, 1);
    const fin = new Date(anio + 1, 0, 1);

    const pagos = await this.prisma.pagos.aggregate({
      _sum: { monto: true },
      where: {
        fecha_pago: {
          gte: inicio,
          lt: fin
        }
      }
    });

    return pagos._sum.monto || 0;
  }

  // ============================================
  // 📌 4. Total recaudado por cada mes del año
  // ============================================
    async resumenMensual(anio: number) {
    const meses: { mes: number; total: number }[] = [];

    for (let m = 1; m <= 12; m++) {
        const total = await this.totalPorMes(anio, m);
        meses.push({ mes: m, total: Number(total) });
    }

    return meses;
    }


  // ============================================
  // 📌 5. Obtener pagos de un cliente
  // ============================================
  async pagosPorCliente(id_cliente: number) {
    const existe = await this.prisma.clientes.findUnique({
      where: { id_cliente }
    });

    if (!existe) throw new NotFoundException("Cliente no encontrado");

    return await this.prisma.pagos.findMany({
      where: { id_cliente },
      include: {
        membresia: true
      },
      orderBy: { fecha_pago: 'desc' }
    });
  }
}
