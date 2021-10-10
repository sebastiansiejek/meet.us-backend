import { Test, TestingModule } from '@nestjs/testing';
import { Event, eventType } from './entities/event.entity';
import { EventsService } from './events.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('EventsService', () => {
  let eventsService: EventsService;
  let eventsRepository: Repository<Event>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
      ],
    }).compile();

    eventsService = module.get<EventsService>(EventsService);
    eventsRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  it('should be defined', () => {
    expect(eventsService).toBeDefined();
  });

  it('should be an array of events', async () => {
    const testEvent = {
      eventId: '',
      title: '',
      description: '',
      type: eventType.Sport,
      createdAt: new Date(),
      updatedAt: new Date(),
      startDate: new Date(),
      endDate: new Date(),
    };

    jest.spyOn(eventsRepository, 'find').mockResolvedValue([testEvent]);
    expect(await eventsService.findAll()).toEqual([testEvent]);
  });
});
