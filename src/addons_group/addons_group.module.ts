import { Module } from '@nestjs/common';
import { AddonsGroupService } from './addons_group.service';
import { AddonsGroupController } from './addons_group.controller';

@Module({
  controllers: [AddonsGroupController],
  providers: [AddonsGroupService],
})
export class AddonsGroupModule {}
