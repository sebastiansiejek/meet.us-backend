import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image]), UsersModule, EventsModule],
  providers: [ImagesService],
  controllers: [ImagesController],
})
export class ImagesModule {}
