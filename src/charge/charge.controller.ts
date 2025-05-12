import { Controller, Delete, Param, Patch, Post , Get, Body, ParseIntPipe} from '@nestjs/common';
import { ChargeService } from './charge.service';
import { UpdateChargeDto } from './dto/updateCharge.dto';
import { CreateChargeDto } from './dto/createCharge.dto';

@Controller('restaurant/charge')
export class ChargeController {
  constructor(private readonly chargeService: ChargeService) {}


  @Post()
  async createCharge(@Body( ) createchargeDto: CreateChargeDto) {
    return this.chargeService.createCharge(createchargeDto);
  }


  @Patch(':id')
  async updateCharge(@Param('id') id: string , @Body() updatechargeDto : UpdateChargeDto) {
    return this.chargeService.updateCharge(id , updatechargeDto);
  }

  @Delete(':id')
  async deleteCharge(@Param('id') id: string) {
    return this.chargeService.deleteCharge(id);
  }

  @Get(':resid/restaurant/:page/:limit')
  async getChargeByRestaurant(@Param('resid') resid: string , @Param('page' , ParseIntPipe) page: number, @Param('limit' ,  ParseIntPipe) limit: number) {
    return this.chargeService.getChargeByRestaurant(resid , page , limit);
  }

  @Get(':id')
  async getCharge(@Param('id') id: string) {
    return this.chargeService.getCharge(id);
  }

  @Get(':page/:limit')
  async getAllCharges(@Param('page', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number) {
    return this.chargeService.getAllCharges(page , limit);
  }

}
