import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImagesService } from './images.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImagesService],
})
export class ImagesModule {}
