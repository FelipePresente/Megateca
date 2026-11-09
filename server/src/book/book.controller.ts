import { Controller, Get, Post, Put, Delete, Body, Param, NotFoundException } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() body: { title: string; units?: number; year: Date; authorId: number; genreId: string }) {
    return this.bookService.create(body);
  }

  @Get()
  async findAll() {
    return this.bookService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const book = await this.bookService.findOne(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { title?: string; units?: number; year?: Date; authorId?: number; genreId?: string }) {
    const book = await this.bookService.update(id, body);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const book = await this.bookService.remove(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }
}
