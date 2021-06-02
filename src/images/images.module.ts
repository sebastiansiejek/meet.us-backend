import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { ImagesService } from './images.service';
import { ImagesResolver } from './images.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImagesService, ImagesResolver],
})
export class ImagesModule {}
