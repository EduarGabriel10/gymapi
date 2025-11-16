import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientesService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Crear un cliente
  async create(data: Prisma.ClientesCreateInput) {
    return this.prisma.clientes.create({ data });
  }

  // 🔹 Obtener todos los clientes (con entrenador opcional)
  async findAll() {
    return this.prisma.clientes.findMany({
      include: {
        entrenador: { select: { nombre: true, apellido: true, especialidad: true } },
        Pagos: true,
        Asistencia: true,
        Rutinas: true,
      },
    });
  }

  // 🔹 Obtener cliente por ID
  async findOne(id_cliente: number) {
    const cliente = await this.prisma.clientes.findUnique({
      where: { id_cliente },
      include: {
        entrenador: { select: { nombre: true, apellido: true, especialidad: true } },
        Pagos: true,
        Asistencia: true,
        Rutinas: true,
      },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  // 🔹 Actualizar datos del cliente (no usuario)
  async update(id_cliente: number, data: Prisma.ClientesUpdateInput) {
    const cliente = await this.prisma.clientes.findUnique({ where: { id_cliente } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return this.prisma.clientes.update({ where: { id_cliente }, data });
  }

  // 🔹 Eliminar cliente
  async remove(id_cliente: number) {
    const cliente = await this.prisma.clientes.findUnique({ where: { id_cliente } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return this.prisma.clientes.delete({ where: { id_cliente } });
  }

  // 🔹 Ver entrenador asignado
  async getEntrenador(id_cliente: number) {
    const cliente = await this.prisma.clientes.findUnique({
      where: { id_cliente },
      include: { entrenador: true },
    });
    if (!cliente?.entrenador) throw new NotFoundException('No tiene entrenador asignado');
    return cliente.entrenador;
  }

  // 🔹 Cambiar entrenador
  async cambiarEntrenador(id_cliente: number, id_entrenador: number) {
    const entrenador = await this.prisma.entrenadores.findUnique({ where: { id_entrenador } });
    if (!entrenador) throw new NotFoundException('Entrenador no encontrado');

    return this.prisma.clientes.update({
      where: { id_cliente },
      data: { id_entrenador },
    });
  }

  // 🔹 Registrar asistencia
  async registrarAsistencia(id_cliente: number) {
    const cliente = await this.prisma.clientes.findUnique({ where: { id_cliente } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    return this.prisma.asistencia.create({
      data: {
        id_cliente,
        fecha: new Date(),
        hora: new Date(),
      },
    });
  }

  // 🔹 Ver historial de asistencias
  async verAsistencias(id_cliente: number) {
    return this.prisma.asistencia.findMany({
      where: { id_cliente },
      orderBy: { fecha: 'desc' },
    });
  }

  // 🔹 Registrar un pago y actualizar membresía
  async registrarPago(id_cliente: number, id_membresia: number, monto: number) {
    const cliente = await this.prisma.clientes.findUnique({ where: { id_cliente } });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    const membresia = await this.prisma.membresias.findUnique({ where: { id_membresia } });
    if (!membresia) throw new NotFoundException('Membresía no encontrada');

    const fecha_pago = new Date();
    const fecha_vencimiento = new Date();
    fecha_vencimiento.setDate(fecha_pago.getDate() + membresia.duracion_dias);

    // Registrar pago
    const pago = await this.prisma.pagos.create({
      data: {
        id_cliente,
        id_membresia,
        fecha_pago,
        fecha_vencimiento,
        monto,
      },
    });

    // Actualizar membresía del cliente
    await this.prisma.clientes.update({
      where: { id_cliente },
      data: { estado_membresia: 'activa' },
    });

    return pago;
  }

  // 🔹 Ver estado de membresía
  async estadoMembresia(id_cliente: number) {
    const cliente = await this.prisma.clientes.findUnique({
      where: { id_cliente },
      include: { Pagos: { orderBy: { fecha_vencimiento: 'desc' }, take: 1 } },
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    const ultimoPago = cliente.Pagos[0];
    if (!ultimoPago) return { estado: 'inactiva', mensaje: 'Sin pagos registrados' };

    const activa = new Date() <= new Date(ultimoPago.fecha_vencimiento);
    return {
      estado: activa ? 'activa' : 'inactiva',
      vence: ultimoPago.fecha_vencimiento,
    };
  }

  // 🔹 Ver rutinas asignadas
  async verRutinas(id_cliente: number) {
    return this.prisma.rutinas.findMany({
      where: { id_cliente },
      include: { entrenador: { select: { nombre: true, apellido: true } } },
      orderBy: { fecha_asignacion: 'desc' },
    });
  }
}
