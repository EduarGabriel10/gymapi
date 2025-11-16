import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:8100',
        'http://localhost',
        'capacitor://localhost',
        'ionic://localhost',
        'https://gymapi-c6v8.onrender.com',
      ];
  
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // permitir
      } else {
        callback(new Error('Not allowed by CORS'), false); // bloquear
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
  console.log('Server started on port 3000');
}
bootstrap();
