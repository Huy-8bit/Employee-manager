import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/user.entity';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, UserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'oracle',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      sid: process.env.DB_SID,
      entities: [UserEntity],
      synchronize: false,
    })],
  controllers: [],
  providers: [],
})
export class AppModule { }
