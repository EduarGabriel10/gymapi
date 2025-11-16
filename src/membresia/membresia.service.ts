import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { addMonths } from 'date-fns';

@Injectable()
export class MembresiaService {
  constructor(private prisma: PrismaService) {}

  // 📦 Crear una nueva membresía
  async crearMembresia(data: Prisma.MembresiasCreateInput) {
    return await this.prisma.membresias.create({ data });
  }

  // 📋 Ver todas las membresías
  async verTodasMembresias() {
    return await this.prisma.membresias.findMany();
  }

  // 🔍 Ver una membresía por ID
  async verMembresia(id_membresia: number) {
    const membresia = await this.prisma.membresias.findUnique({
      where: { id_membresia },
    });
    if (!membresia) throw new NotFoundException('Membresía no encontrada');
    return membresia;
  }

  // ✏️ Actualizar membresía
  async actualizarMembresia(
    id_membresia: number,
    data: Prisma.MembresiasUpdateInput,
  ) {
    return await this.prisma.membresias.update({
      where: { id_membresia },
      data,
    });
  }

  // 🗑️ Eliminar membresía
  async eliminarMembresia(id_membresia: number) {
    return await this.prisma.membresias.delete({
      where: { id_membresia },
    });
  }

  // 💳 Registrar un pago y calcular la fecha de vencimiento
  async registrarPago(
    id_cliente: number,
    id_membresia: number,
    monto: number,
  ) {
    const membresia = await this.prisma.membresias.findUnique({
      where: { id_membresia },
    });
    if (!membresia) throw new NotFoundException('Membresía no encontrada');

    const hoy = new Date();
    let fecha_vencimiento = new Date(hoy);

    // 📅 Calcular vencimiento según tipo de plan
    switch (membresia.tipo.toLowerCase()) {
      case 'mensual':
        fecha_vencimiento = addMonths(hoy, 1);
        break;
      case 'trimestral':
        fecha_vencimiento = addMonths(hoy, 3);
        break;
      case 'anual':
        fecha_vencimiento = addMonths(hoy, 12);
        break;
      default:
        // Si el tipo no coincide, se deja 1 mes por defecto
        fecha_vencimiento = addMonths(hoy, 1);
        break;
    }


    // 💾 Registrar el pago
    const pago = await this.prisma.pagos.create({
      data: {
        id_cliente,
        id_membresia,
        monto,
        fecha_pago: hoy,
        fecha_vencimiento,
      },
    });

    // 🔄 Actualizar estado de membresía del cliente
    await this.prisma.clientes.update({
      where: { id_cliente },
      data: { estado_membresia: 'activa' },
    });

    return pago;
  }

  // 🧾 Ver historial de pagos del cliente
  async historialPagos(id_cliente: number) {
    return await this.prisma.pagos.findMany({
      where: { id_cliente },
      include: {
        membresia: true,
      },
      orderBy: { fecha_pago: 'desc' },
    });
  }

  // 🧠 Calcular estado actual de la membresía
  async estadoActual(id_cliente: number) {
    const ultimoPago = await this.prisma.pagos.findFirst({
      where: { id_cliente },
      orderBy: { fecha_vencimiento: 'desc' },
    });

    if (!ultimoPago) {
      return { estado: 'inactiva', mensaje: 'El cliente no tiene pagos registrados.' };
    }

    const hoy = new Date();
    const activa = hoy <= new Date(ultimoPago.fecha_vencimiento);

    // Actualizar estado del cliente en BD
    await this.prisma.clientes.update({
      where: { id_cliente },
      data: { estado_membresia: activa ? 'activa' : 'inactiva' },
    });

    return {
      estado: activa ? 'activa' : 'inactiva',
      fecha_vencimiento: ultimoPago.fecha_vencimiento,
      ultimo_pago: ultimoPago.fecha_pago,
    };
  }
}
