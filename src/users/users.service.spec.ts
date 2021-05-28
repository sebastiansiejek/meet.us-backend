import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('should return an array of users', async () => {
    const testUser = {
      email: '',
      firstName: '',
      lastname: '',
      nickname: '',
      id: '',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest.spyOn(usersRepository, 'find').mockResolvedValueOnce([testUser]);
    expect(await usersService.findAll()).toEqual([testUser]);
  });
});
