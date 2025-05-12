import { Module } from '@nestjs/common';
import { ServiceTypeController } from './service-type.controller';
import { ServiceTypeService } from './service-type.service';

@Module({
  controllers: [ServiceTypeController],
  providers: [ServiceTypeService]
})
export class ServiceTypeModule {}
