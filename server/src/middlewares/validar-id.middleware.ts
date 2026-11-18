import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Validador de ID na URL (adaptado ao tema Livraria).
 *
 * Protege as rotas GET /:id, PUT /:id e DELETE /:id contra parâmetros
 * ausentes ou inválidos. No schema.prisma desta API o id do Book é UUID,
 * então o middleware garante que o :id seja um valor não vazio (string válida),
 * evitando que a consulta ao banco quebre a aplicação.
 */
@Injectable()
export class ValidarIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    if (!id || id.trim() === '') {
      throw new BadRequestException({
        erro: "ID inválido na URL. Informe um identificador válido.",
      });
    }

    next();
  }
}
