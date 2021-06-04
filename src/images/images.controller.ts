import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImagesService } from './images.service';
import { UsersService } from '../users/users.service';
import { EventsService } from 'src/events/events.service';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imageService: ImagesService,
    private readonly userService: UsersService,
    private readonly eventService: EventsService,
  ) {}
  @Post('upload-avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/avatars',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadAvatarImage(userId: string, @UploadedFile() file) {
    const image = await this.imageService.saveImage(
      file.filename,
      file.replace(/(public\\)/m, ''),
    );
    this.userService.addImage(userId, image);
    return image;
  }

  @Post('upload-event-cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads/event/cover',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadEventCover(eventId: string, @UploadedFile() file) {
    const image = await this.imageService.saveImage(
      file.filename,
      file.path.replace(/(public\\)/m, ''),
    );
    this.eventService.addImage(eventId, image);
    return image;
  }
}
