import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import * as path from 'path';
import { ImagesModule } from './images/images.module';
import { Upload } from './images/dto/Upload.scalar';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, 'i18n'),
        watch: true,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '**/*/entities/*.entity.*'],
      synchronize: true,
      keepConnectionAlive: true,
    }),
    GraphQLModule.forRoot({
      context: ({ req, connection }) =>
        connection ? { req: connection.context } : { req },
      autoSchemaFile: true,
      sortSchema: true,
      uploads: {
        maxFileSize: 5000000, // 20 MB
        maxFiles: 5
      }
    }),
    UsersModule,
    MailModule,
    AuthModule,
    EventsModule,
    ImagesModule, 
  ],
  providers: [Upload]
})
export class AppModule {}
