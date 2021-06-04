import { forwardRef, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsResolver } from './events.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { ImagesModule } from 'src/images/images.module';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), forwardRef(() => ImagesModule)],
  providers: [EventsResolver, EventsService],
  exports: [EventsService],
})
export class EventsModule {}
