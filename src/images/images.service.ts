import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async saveImage(name: string, path: string) {
    return this.imageRepository.save({
      name: name,
      path: path,
    });
  }

  async removeImage(image: Image) {
    const imageDetails = await this.imageRepository.findOne({
      id: image.id,
    });

    if (imageDetails.id != null) {
      fs.unlinkSync('./public/' + imageDetails.path);
    }

    this.imageRepository.remove(imageDetails);
    return { message: 'Image has been deleted' };
  }
}
