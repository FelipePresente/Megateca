import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { title: string; units?: number; year: Date; authorId: number; genreId: string }) {
    return this.prisma.book.create({
      data: {
        title: data.title,
        units: data.units,
        year: data.year,
        author: { connect: { id: data.authorId } },
        genre: { connect: { id: data.genreId } },
      },
      include: { author: true, genre: true },
    });
  }

  async findAll() {
    return this.prisma.book.findMany({
      include: { author: true, genre: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.book.findUnique({
      where: { id },
      include: { author: true, genre: true },
    });
  }

  async update(id: string, data: { title?: string; units?: number; year?: Date; authorId?: number; genreId?: string }) {
    return this.prisma.book.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.units !== undefined && { units: data.units }),
        ...(data.year !== undefined && { year: data.year }),
        ...(data.authorId !== undefined && { author: { connect: { id: data.authorId } } }),
        ...(data.genreId !== undefined && { genre: { connect: { id: data.genreId } } }),
      },
      include: { author: true, genre: true },
    });
  }

  async remove(id: string) {
    return this.prisma.book.delete({
      where: { id },
    });
  }
}
