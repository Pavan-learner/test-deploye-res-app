import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class TableService {
    constructor(private readonly prismaService : PrismaService) {}
    // Creating of a table
    async createTable(createTableDto: any) {
        return this.prismaService.table.create({
            data: {
                tableNumber: createTableDto.tableNumber,
                sectionId: createTableDto.sectionId,
                location: createTableDto.location,
                tableStatus: createTableDto.tableStatus,
                status: createTableDto.status,
                restaurantId: createTableDto.restaurantId,
            },
        });
    }

    // Updating of a table
    async updateTable(id: string, updateTableDto: any) {
        return this.prismaService.table.update({
            where: { id },
            data: {
                tableNumber: updateTableDto.tableNumber,
                sectionId: updateTableDto.sectionId,
                location: updateTableDto.location,
                tableStatus: updateTableDto.tableStatus,
                status: updateTableDto.status,
            },
        });
    }
    
   
    // Deleting of a table
    async deleteTable(id: string) {
        return this.prismaService.table.delete({
            where: { id },
        });
    }

     // Getting the tables based for the restaurant id
     async findByRestaurantId(resid: string) {
        return this.prismaService.table.findMany({
            where: { restaurantId: resid },
        });
    }

    // Getting all tables
    async getAllTables(sectionId: string) {
        return this.prismaService.table.findMany({
            where: { sectionId },
        });
    }

    // Getting a table by id
    async getTableById(id: string) {
        return this.prismaService.table.findUnique({
            where: { id },
        });
    }
    
}
