import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: [
      'http://localhost:8100',
      'capacitor://localhost',
      'ionic://localhost',
      'http://localhost',
      'https://gymapi-c6v8.onrender.com', // opcional
      '*', // si quieres permitir todos temporalmente
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
  console.log('Server started on port 3000');
}
bootstrap();
