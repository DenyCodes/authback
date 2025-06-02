import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.module';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
