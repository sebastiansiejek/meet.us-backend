import { Test, TestingModule } from '@nestjs/testing';
import { Event } from './entities/event.entity';
import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';

describe('EventsResolver', () => {
  let resolver: EventsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsResolver,
        EventsService,
        {
          provide: 'EventsRepository',
          useClass: Event,
        },
      ],
    }).compile();

    resolver = module.get<EventsResolver>(EventsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
