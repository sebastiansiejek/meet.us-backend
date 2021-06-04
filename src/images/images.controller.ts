import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImagesService } from './images.service';
import { UsersService } from '../users/users.service';
import { EventsService } from 'src/events/events.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Args } from '@nestjs/graphql';

@Controller('images')
export class ImagesController {
  constructor(
    private readonly imageService: ImagesService,
    private readonly userService: UsersService,
    private readonly eventService: EventsService,
    private readonly i18n: I18nRequestScopeService,
  ) {}
  @UseGuards(JwtAuthGuard)
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
  async uploadAvatarImage(@CurrentUser() user: User, @UploadedFile() file) {
    const userDetails = await this.userService.findOne(user.id);
    if (userDetails.id != user.id) {
      throw new UnauthorizedException(
        await this.i18n.translate('errors.ERRORS.USER_IS_NOT_OWNER_OF_ACCOUNT'),
      );
    }

    const image = await this.imageService.saveImage(
      file.filename,
      file.path.replace(/(public\\)/m, ''),
    );
    this.userService.addImage(user.id, image);

    return image;
  }

  @UseGuards(JwtAuthGuard)
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
  async uploadEventCover(
    @CurrentUser() user: User,
    @Args('eventId') eventId: string,
    @UploadedFile() file,
  ) {
    const eventDetails = await this.eventService.findOne(eventId);

    if (eventDetails.user.id != user.id) {
      throw new UnauthorizedException(
        await this.i18n.translate('errors.ERRORS.USER_IS_NOT_OWNER_OF_EVENT'),
      );
    }

    const image = await this.imageService.saveImage(
      file.filename,
      file.path.replace(/(public\\)/m, ''),
    );
    this.eventService.addImage(eventId, image);
    return image;
  }
}
