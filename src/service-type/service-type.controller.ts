import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ServiceTypeService } from './service-type.service';
import { createServiceTypeDto } from './dto/createServiceType.dto';
import { updateServiceTypeDto } from './dto/updateServiceType.dto';

@Controller('service-type')
export class ServiceTypeController {
    constructor(private readonly serviceTypeService: ServiceTypeService) {}

    // Create a new service type
    @Post()
    async createServiceType(@Body() createserviceType: createServiceTypeDto){
        return await this.serviceTypeService.createServiceType(createserviceType);
    }

    // Update a service type by ID
    @Patch(':id')
    async updateServiceTypeById(@Param('id') id: string, @Body() updateservicetype: updateServiceTypeDto) {
        return await this.serviceTypeService.updateServiceTypeById(id, updateservicetype);
    }

    @Delete(':id')
    async deleteServiceTypeById(@Param('id') id: string) {
        return await this.serviceTypeService.deleteServiceTypeById(id);
    }


    // Get all the service types
    @Get()
    async getAllServiceType() {
        return await this.serviceTypeService.getAllServiceTypes();
    }

    // Get a service type by ID
    @Get(':id')
    async getServiceTypeById(@Param('id') id: string) {
        return await this.serviceTypeService.getServiceTypeById(id);
    }

}
