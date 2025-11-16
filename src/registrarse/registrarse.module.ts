import { Module } from '@nestjs/common';
import { RegistrarseService } from './registrarse.service';
import { RegistrarseController } from './registrarse.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [RegistrarseController],
  providers: [RegistrarseService, PrismaService],
})
export class RegistrarseModule {}
