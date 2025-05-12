import { Body, Controller, Get, Param, Patch, Post , Delete } from '@nestjs/common';
import { TaxService } from './tax.service';
import { createTaxDto } from './dto/createTax.dto';
import { updateTaxDto } from './dto/updateTax.dto';

@Controller('restaurant/tax')
export class TaxController {

    constructor(private readonly taxService: TaxService){}

    
    @Get(':resid/restaurant')
    async getTaxByRestaurant(@Param('resid') resid: string) {
        return await this.taxService.getTaxesByRestaurantId(resid);
    }

    @Get(':id')
    async getTax(@Param('id') id: string) {
        return await this.taxService.getTaxById(id);
    }

    @Get()
    async getAllTaxes() {
        return await this.taxService.getAllTaxes();
    }

    // for creating a tax
    @Post()
    async createTax(@Body() taxData: createTaxDto) {
        return await this.taxService.createTax(taxData);
    }

    // For updating a tax info 
    @Patch(':id')
    async updateTax(@Param('id') id: string, @Body() taxData: updateTaxDto) {
        return await this.taxService.updateTax(id, taxData);
    }

    @Delete(':id')
    async deleteTax(@Param('id') id: string) {
        return await this.taxService.deleteTax(id);
    }


    
}

