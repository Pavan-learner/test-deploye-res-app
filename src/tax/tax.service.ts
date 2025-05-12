import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { createTaxDto } from './dto/createTax.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class TaxService {
    constructor(private readonly prismaService: PrismaService) {}

    // Method to create a tax
    async createTax(taxData: createTaxDto) {
        return await this.prismaService.tax.create({
            data: {
                restaurantId: taxData.restaurantId,
                name: taxData.name,
                rate: taxData.rate,
                status:taxData.status,
            },
        });
    }

    // Method to get all taxes
    async getAllTaxes() {
        return await this.prismaService.tax.findMany({
            include:{
                restaurant: true,
            }
        });
    }

    // Method to get a tax by ID
    async getTaxById(taxId: string) {
        return await this.prismaService.tax.findUnique({
            where: {
                id: taxId,
            },
        });
    }

    // Method to update a tax
    async updateTax(taxId: string, taxData: { name?: string; rate?: number }) {
        return await this.prismaService.tax.update({
            where: {
                id: taxId,
            },
            data: {
                ...taxData,
            },
        });
    }
    // Method to delete a tax
    async deleteTax(taxId: string) {
        try {
            const tax = await this.prismaService.tax.delete({
                where: {
                    id: taxId,
                },
            });

            

            return {
               success : true,
            };
        } catch (error) {
            if(error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
                return {
                    message: 'The tax you are trying to delete does not exist',
                    statusCode: 400,
                };
            }

            throw new InternalServerErrorException('Error deleting tax');
        }
    }
    // Method to get all taxes by restaurant ID
    async getTaxesByRestaurantId(restaurantId: string) {
        return await this.prismaService.tax.findMany({
            where: {
                restaurantId: restaurantId,
            }
        });
    }
}
