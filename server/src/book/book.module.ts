import { Module } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [BookController],
  providers: [BookService, PrismaService],
  exports: [BookService],
})
export class BookModule {}
