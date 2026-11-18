import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { PrismaService } from '../prisma.service';
import { ValidarIdMiddleware } from '../middlewares/validar-id.middleware';
import { ValidarDadosMiddleware } from '../middlewares/validar-dados.middleware';

@Module({
  controllers: [BookController],
  providers: [BookService, PrismaService],
  exports: [BookService],
})
export class BookModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidarIdMiddleware)
      .forRoutes({ path: 'books/:id', method: RequestMethod.ALL })
      .apply(ValidarDadosMiddleware)
      .forRoutes(BookController);
  }
}
