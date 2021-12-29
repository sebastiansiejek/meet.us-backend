import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { GraphQLModule } from '@nestjs/graphql';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { MailModule } from './mail/mail.module';
import { Module } from '@nestjs/common';
import { QueryResolver } from './i18n/QueryResolver';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { ParticipantsModule } from './participants/participants.module';
import { CompaniesModule } from './companies/companies.module';
import { UserActivityModule } from './user-activity/user-activity.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'pl-*': 'pl',
      },
      parser: I18nJsonParser,
      parserOptions: {
        path: join(__dirname, 'i18n'),
        watch: true,
      },
      resolvers: [{ use: QueryResolver, options: [] }],
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
      autoSchemaFile: true,
      sortSchema: true,
    }),
    UsersModule,
    MailModule,
    AuthModule,
    EventsModule,
    ScheduleModule.forRoot(),
    ParticipantsModule,
    CompaniesModule,
    UserActivityModule,
  ],
})
export class AppModule {}
