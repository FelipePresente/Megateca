import { ConflictException, NotFoundException, BadRequestException, InternalServerErrorException } from "@nestjs/common";

export default function prismaErrorHandler(error: any, entityName: string = 'Record'): never {
    if (error?.code === 'P2002') {
        throw new ConflictException(`${entityName} already exists or is in use`)
    }

    if (error?.code === 'P2025') {
        throw new NotFoundException(`${entityName} not found`)
    }

    if (error?.code === 'P2003') {
        throw new BadRequestException(`Invalid reference: related record does not exist`)
    }

    console.error("Prisma Error Captured", error)
    throw new InternalServerErrorException('An unexpected database error ocurred')
}