import { Module } from '@nestjs/common';
import { MenuSettingsService } from './menu-settings.service';
import { MenuSettingsController } from './menu-settings.controller';

@Module({
  controllers: [MenuSettingsController],
  providers: [MenuSettingsService],
})
export class MenuSettingsModule {}
