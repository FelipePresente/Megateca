import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware Global de Auditoria (Logger).
 *
 * Exibe no terminal todas as requisições recebidas em tempo real,
 * útil para demonstrar o funcionamento do servidor ao vivo.
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url}`,
    );
    next();
  }
}
