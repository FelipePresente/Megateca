import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Validação e Sanitização de Dados (adaptado ao tema Livraria - Book).
 *
 * Valida os campos obrigatórios antes de salvar no banco via Prisma.
 * Aplica-se nas rotas POST e PUT de /books.
 */
@Injectable()
export class ValidarDadosMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'POST' && req.method !== 'PUT') {
      return next();
    }

    const { title, authorId, genreId } = req.body as Record<string, unknown>;

    if (req.method === 'POST') {
      if (!title || typeof title !== 'string' || title.trim().length < 5) {
        throw new BadRequestException({
          erro: "O título é obrigatório e deve ter no mínimo 5 caracteres.",
        });
      }

      if (!authorId) {
        throw new BadRequestException({
          erro: "O 'authorId' é obrigatório.",
        });
      }

      if (!genreId) {
        throw new BadRequestException({
          erro: "O 'genreId' é obrigatório.",
        });
      }
    }

    // Sanitização: remove espaços extras nas pontas
    if (title && typeof title === 'string') {
      (req.body as Record<string, unknown>).title = title.trim();
    }

    next();
  }
}
