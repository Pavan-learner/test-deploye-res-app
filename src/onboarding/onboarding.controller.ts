import { Body, Controller, Param, Post } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { createMerchantDto } from './dto/createMerchant.dto';

@Controller('restaurant/onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  // in this route we will create the restaurant and admin (owner)
  @Post()
  async merchant(@Body() createMerchantdto : createMerchantDto) {
    return this.onboardingService.merchant(createMerchantdto);
  }

}
