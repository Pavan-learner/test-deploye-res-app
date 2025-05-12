import { Module } from '@nestjs/common';
import { MenuVariantService } from './menu-variant.service';
import { MenuVariantController } from './menu-variant.controller';

@Module({
  providers: [MenuVariantService],
  controllers: [MenuVariantController] // Add your controllers here
})
export class MenuVariantModule {}
