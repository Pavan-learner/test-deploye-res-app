import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { ReportModule } from './report/report.module';
import { OrderModule } from './order/order.module';
import { AddonModule } from './addon/addon.module';
import { AddonsGroupModule } from './addons_group/addons_group.module';
import { CategoryModule } from './category/category.module';
import { ChargeModule } from './charge/charge.module';
import { DiscountModule } from './discount/discount.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TaxModule } from './tax/tax.module';
import { RestaurantServicesModule } from './restaurant-services/restaurant-services.module';
import { ServiceTypeModule } from './service-type/service-type.module';
import { MenuModule } from './menu/menu.module';
import { MenuVariantModule } from './menu-variant/menu-variant.module';
import { TableModule } from './table/table.module';
import { SectionModule } from './section/section.module';
import { MenuSettingsModule } from './menu-settings/menu-settings.module';
import { OrderDetailsModule } from './order-details/order-details.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    OnboardingModule,
    AuthModule,
    PrismaModule,
    UsersModule,
    RestaurantModule,
    TaxModule,
    RestaurantServicesModule,
    ServiceTypeModule,
    CategoryModule,
    MenuModule,
    MenuVariantModule,
    AddonsGroupModule,
    AddonModule,
    TableModule,
    SectionModule,
    DiscountModule,
    ChargeModule,
    MenuSettingsModule,
    OrderModule,
    OrderDetailsModule,
    PaymentModule,
    ReportModule
  ],
})
export class AppModule {}
