import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrarseService {
  constructor(private prisma: PrismaService) {}

  //Registro general (por defecto: cliente)
  async registrarseGeneral(data: {
    username: string;
    password: string;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono?: string;
    email?: string;
  }) {
    const { username, password, nombre, apellido, cedula, telefono, email } = data;

    // Validar duplicados
    const existeUsuario = await this.prisma.usuarios.findUnique({ where: { username } });
    if (existeUsuario) throw new BadRequestException('El nombre de usuario ya existe.');

    const existeCedula = await this.prisma.clientes.findUnique({ where: { cedula } });
    if (existeCedula) throw new BadRequestException('La cédula ya está registrada.');

    // Buscar el rol "Cliente"
    const rolCliente = await this.prisma.roles.findFirst({
      where: { nombre: 'Cliente' },
    });
    if (!rolCliente) throw new BadRequestException('No existe el rol Cliente en la base de datos.');

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = await this.prisma.usuarios.create({
      data: {
        username,
        password: hashedPassword,
        id_rol: rolCliente.id_rol,
      },
    });

    // Crear cliente asociado
    const cliente = await this.prisma.clientes.create({
      data: {
        nombre,
        apellido,
        cedula,
        telefono,
        email,
        id_usuario: usuario.id_usuario,
      },
    });

    console.log('✅ Cliente registrado exitosamente:', cliente);
    return { message: 'Registro exitoso como cliente', usuario, cliente };
  }

  // Crear ADMIN (solo admin)
  async crearAdmin(data: { username: string; password: string }) {
    const { username, password } = data;

    const existe = await this.prisma.usuarios.findUnique({ where: { username } });
    if (existe) throw new BadRequestException('El nombre de usuario ya existe.');

    const rolAdmin = await this.prisma.roles.findFirst({ where: { nombre: 'Admin' } });
    if (!rolAdmin) throw new BadRequestException('No existe el rol Admin.');

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await this.prisma.usuarios.create({
      data: {
        username,
        password: hashedPassword,
        id_rol: rolAdmin.id_rol,
      },
    });

    console.log(' Nuevo admin creado:', admin);
    return { message: 'Administrador creado correctamente', admin };
  }

  
  // Crear CLIENTE (solo admin)
  async crearCliente(data: {
    username: string;
    password: string;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono?: string;
    email?: string;
    id_entrenador?: number;
  }) {
    const { username, password, nombre, apellido, cedula, telefono, email, id_entrenador } = data;

    const existeUsuario = await this.prisma.usuarios.findUnique({ where: { username } });
    if (existeUsuario) throw new BadRequestException('El nombre de usuario ya existe.');

    const existeCedula = await this.prisma.clientes.findUnique({ where: { cedula } });
    if (existeCedula) throw new BadRequestException('La cédula ya está registrada.');

    const rolCliente = await this.prisma.roles.findFirst({ where: { nombre: 'Cliente' } });
    if (!rolCliente) throw new BadRequestException('No existe el rol Cliente.');

    const hashedPassword = await bcrypt.hash(password, 10);

    const usuario = await this.prisma.usuarios.create({
      data: {
        username,
        password: hashedPassword,
        id_rol: rolCliente.id_rol,
      },
    });

    const cliente = await this.prisma.clientes.create({
      data: {
        nombre,
        apellido,
        cedula,
        telefono,
        email,
        id_entrenador,
        id_usuario: usuario.id_usuario,
      },
    });

    console.log(' Cliente creado por admin:', cliente);
    return { message: 'Cliente creado correctamente', usuario, cliente };
  }

  // Crear ENTRENADOR (solo admin)
async crearEntrenador(data: {
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  especialidad?: string;
  telefono?: string;
  email?: string;
}) {
  const { username, password, nombre, apellido, especialidad, telefono, email } = data;

  // 🔎 Validar username duplicado
  const existeUsuario = await this.prisma.usuarios.findUnique({
    where: { username },
  });
  if (existeUsuario)
    throw new BadRequestException('El nombre de usuario ya existe.');

  // 🔎 Validar email duplicado en entrenadores
  if (email) {
    const emailExistente = await this.prisma.entrenadores.findFirst({
      where: { email },
    });
    if (emailExistente)
      throw new BadRequestException('El correo ya está registrado para otro entrenador.');
  }

  // 🔎 Validar teléfono duplicado
  if (telefono) {
    const telefonoExistente = await this.prisma.entrenadores.findFirst({
      where: { telefono },
    });
    if (telefonoExistente)
      throw new BadRequestException('El teléfono ya está registrado para otro entrenador.');
  }

  // 🔎 Buscar rol Entrenador
  const rolEntrenador = await this.prisma.roles.findFirst({
    where: { nombre: 'Entrenador' },
  });
  if (!rolEntrenador)
    throw new BadRequestException('No existe el rol Entrenador en la base de datos.');

  // 🔐 Encriptar contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // 🧩 Crear usuario
  const usuario = await this.prisma.usuarios.create({
    data: {
      username,
      password: hashedPassword,
      id_rol: rolEntrenador.id_rol,
    },
  });

  // 🧩 Crear entrenador vinculado
  const entrenador = await this.prisma.entrenadores.create({
    data: {
      nombre,
      apellido,
      especialidad,
      telefono,
      email,
      id_usuario: usuario.id_usuario,
    },
  });

  console.log('🏋️ Entrenador creado:', entrenador);

  return {
    message: 'Entrenador creado correctamente',
    usuario,
    entrenador,
  };
}

}
