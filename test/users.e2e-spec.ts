// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createInputObject } from './helpers/testHelpers';

describe('Users (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Find all', () => {
    const findUsersQuery = `query {
      users {
        firstName,
        id
      }
    }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: findUsersQuery,
      })
      .expect(({ body }) => {
        const { data } = body;
        const { users } = data;
        expect(users.length).toBeGreaterThan(0);
      })
      .expect(200);
  });

  it('Create', () => {
    const sampleUser: CreateUserInput = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    };

    const createUsersMutation = `mutation {
      createUser(createUserInput: ${createInputObject(sampleUser)}) {
        id,
      }
    }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createUsersMutation,
      })
      .expect(200);
  });
});
