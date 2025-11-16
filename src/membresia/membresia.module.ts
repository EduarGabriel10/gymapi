import { Module } from '@nestjs/common';
import { MembresiaService } from './membresia.service';
import { MembresiaController } from './membresia.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [MembresiaController],
  providers: [MembresiaService,PrismaModule],
})
export class MembresiaModule {}
