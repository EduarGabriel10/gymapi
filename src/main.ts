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
  
      console.log('🔍 Origin recibido:', origin);
  
      // Permitir requests sin origin (por ejemplo: apps móviles, Postman, Render)
      if (!origin) {
        return callback(null, true);
      }
  
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.log('❌ Origen bloqueado por CORS:', origin);
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });


  
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
  console.log('Server started on port 3000');
}
bootstrap();
