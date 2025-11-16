import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Inicializa el cliente de Prisma
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seed...');

  // --- 1. Limpiar la base de datos (en orden inverso de creación) ---
  // Esto es útil para desarrollo, ¡ten cuidado en producción!
  console.log('Limpiando datos existentes...');
  await prisma.horarios_Entrenadores.deleteMany();
  await prisma.rutinas.deleteMany();
  await prisma.asistencia.deleteMany();
  await prisma.pagos.deleteMany();
  await prisma.membresias.deleteMany();
  await prisma.clientes.deleteMany();
  await prisma.entrenadores.deleteMany();
  await prisma.usuarios.deleteMany();
  await prisma.roles.deleteMany();
  console.log('Datos limpiados.');

  // --- 2. Crear Roles ---
  console.log('Creando roles...');
  const rolAdmin = await prisma.roles.create({
    data: { nombre: 'Administrador' },
  });
  const rolEntrenador = await prisma.roles.create({
    data: { nombre: 'Entrenador' },
  });
  const rolCliente = await prisma.roles.create({
    data: { nombre: 'Cliente' },
  });

  // --- 3. Crear Usuarios (Admin, Entrenador, Cliente) ---
  console.log('Creando usuarios...');
  // Encriptamos una contraseña de ejemplo
  const hashedPassword = await bcrypt.hash('pass123', 10);

  const adminUser = await prisma.usuarios.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      id_rol: rolAdmin.id_rol,
    },
  });

  const entrenadorUser = await prisma.usuarios.create({
    data: {
      username: 'entrenador1',
      password: hashedPassword,
      id_rol: rolEntrenador.id_rol,
    },
  });

  const clienteUser = await prisma.usuarios.create({
    data: {
      username: 'cliente1',
      password: hashedPassword,
      id_rol: rolCliente.id_rol,
    },
  });

  // --- 4. Crear Entrenador ---
  console.log('Creando entrenador...');
  const entrenador1 = await prisma.entrenadores.create({
    data: {
      nombre: 'Carlos',
      apellido: 'Vera',
      especialidad: 'Pesas',
      telefono: '0991111111',
      email: 'carlos.vera@gym.com',
      id_usuario: entrenadorUser.id_usuario, // Se conecta al usuario entrenador
    },
  });

  // --- 5. Crear Cliente ---
  console.log('Creando cliente...');
  const cliente1 = await prisma.clientes.create({
    data: {
      nombre: 'José',
      apellido: 'Quimi',
      cedula: '0958745123',
      telefono: '0987456321',
      email: 'joseq@gmail.com',
      estado_membresia: 'activa',
      id_usuario: clienteUser.id_usuario, // Se conecta al usuario cliente
      id_entrenador: entrenador1.id_entrenador, // Se conecta con el entrenador
    },
  });

  // --- 6. Crear Membresía ---
  console.log('Creando membresía...');
  const membresiaMensual = await prisma.membresias.create({
    data: {
      tipo: 'Mensual',
      precio: 25.0,
      duracion_dias: 30,
    },
  });

  // --- 7. Crear Pago ---
  console.log('Creando pago...');
  await prisma.pagos.create({
    data: {
      id_cliente: cliente1.id_cliente, // Se conecta al cliente
      id_membresia: membresiaMensual.id_membresia, // Se conecta a la membresía
      fecha_pago: new Date('2025-10-01'),
      fecha_vencimiento: new Date('2025-10-31'),
      monto: 25.0,
    },
  });

  // --- 8. Crear Asistencia ---
  console.log('Creando asistencia...');
  await prisma.asistencia.create({
    data: {
      id_cliente: cliente1.id_cliente, // Se conecta al cliente
      fecha: new Date('2025-10-10'),
      // Para tipo TIME, usamos un objeto Date pero la base de datos solo guardará la hora.
      hora: new Date('1970-01-01T08:30:00.000Z'),
    },
  });

  // --- 9. Crear Rutina ---
  console.log('Creando rutina...');
  await prisma.rutinas.create({
    data: {
      id_cliente: cliente1.id_cliente, // Se conecta al cliente
      id_entrenador: entrenador1.id_entrenador, // Se conecta al entrenador
      nivel: 'Intermedio',
      descripcion: 'Rutina de pesas y abdominales',
      fecha_asignacion: new Date('2025-10-05'),
    },
  });

  // --- 10. Crear Horario de Entrenador ---
  console.log('Creando horario de entrenador...');
  await prisma.horarios_Entrenadores.create({
    data: {
      id_entrenador: entrenador1.id_entrenador, // Se conecta al entrenador
      dia: 'Lunes',
      hora_inicio: new Date('1970-01-01T08:00:00.000Z'),
      hora_fin: new Date('1970-01-01T12:00:00.000Z'),
    },
  });

  console.log('¡Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Cierra la conexión de Prisma
    await prisma.$disconnect();
  });