import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantsResolver } from './participants.resolver';

describe('ParticipantsResolver', () => {
  let resolver: ParticipantsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipantsResolver],
    }).compile();

    resolver = module.get<ParticipantsResolver>(ParticipantsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
