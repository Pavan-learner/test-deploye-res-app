import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor2 } from './common/interceptor/testresponse.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Restaurant API')
    .setDescription('Restaurant POS system API documenetation')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc/api', app, documentFactory);

  // this will be help full if we want to transform the request data to something else
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  // we are enablin the global interceptor to handle the response and format all the response in a single format
  app.useGlobalInterceptors(new ResponseInterceptor());


  // this will be used to handle all the exceptions that are not handled by the application
  // app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors();
  
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
