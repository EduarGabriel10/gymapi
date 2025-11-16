import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { LoginModule } from './login/login.module';
import { RegistrarseModule } from './registrarse/registrarse.module';
import { HorarioatencionModule } from './horarioatencion/horarioatencion.module';
import { RutinasModule } from './rutinas/rutinas.module';
import { ClientesModule } from './clientes/clientes.module';
import { MembresiaModule } from './membresia/membresia.module';
import { EntrenadorModule } from './entrenador/entrenador.module';
import { AsistenciaModule } from './asistencia/asistencia.module';
import { AdminModule } from './admin/admin.module';
import { PagosModule } from './pagos/pagos.module';

@Module({
  imports: [PrismaModule, LoginModule, RegistrarseModule, HorarioatencionModule, RutinasModule, ClientesModule, MembresiaModule, EntrenadorModule, AsistenciaModule, AdminModule, PagosModule],
})
export class AppModule {}
