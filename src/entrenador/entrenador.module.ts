import { Module } from '@nestjs/common';
import { EntrenadorService } from './entrenador.service';
import { EntrenadorController } from './entrenador.controller';

@Module({
  controllers: [EntrenadorController],
  providers: [EntrenadorService],
})
export class EntrenadorModule {}
