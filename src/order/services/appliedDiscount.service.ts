import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/database_prisma/prisma.service";

@Injectable()
export class AppliedDiscountService{
    
    constructor(private readonly prismaService : PrismaService){}
    // async createAppliedDiscount(data : any){
    //     try {
    //         const appliedDiscount = await this.prismaService.appliedDiscount.create(data);
    //         return appliedDiscount;
    //     } catch (error) {
    //         throw new InternalServerErrorException("Error creating applied discount", error);
    //     }
    // }
}