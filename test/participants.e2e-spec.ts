// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { CreateUserInput } from '../src/users/dto/create-user.input';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createInputObject } from './helpers/testHelpers';
import { Connection } from 'typeorm';
import {
  getRandomDateFromDate,
  getRandomNumberBetween,
  getRandomValueFromArray,
} from '../utils/getRandoms';
import { CreateEventAddressInput } from '../src/events/dto/create-event-address.input';
import { CreateEventInput } from '../src/events/dto/create-event.input';

describe('Participants (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    connection = moduleFixture.get<Connection>(Connection);
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Participate in event', async () => {
    const newEvent = await createNewUserAndEvent();

    const createUser: CreateUserInput = {
      email: faker.internet.email(),
      password: 'p@ssword1D',
    };

    const newUser = await createNewUser(createUser);

    const loginUsersMutation = `
            mutation{
                login(loginUserInput: {email: "${newUser.body.data?.createUser.email}", password: "p@ssword1D"}){
                  accessToken,
                  refreshToken
                }
            }`;

    const logedIn = await request('http://localhost:3000')
      .post('/graphql')
      .send({
        query: loginUsersMutation,
      })
      .expect(200);

    const participateBody = `
            mutation{
                participateInEvent(participateInEvent: {eventId: "${newEvent.id}", type: 2}){
                    user{
                      id,
                      email,
                    }
                    event{
                      id,
                      title,
                    }
                    type,
                }
            }
        `;

    const response = await request('http://localhost:3000')
      .post('/graphql')
      .set({ Authorization: `Bearer ${logedIn.body.data?.login.accessToken}` })
      .send({
        query: participateBody,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data?.participateInEvent.user.id).toBe(
      newUser.body.data?.createUser.id,
    );
    expect(response.body.data?.participateInEvent.event.id).toBe(newEvent.id);
  });

  async function createNewUserAndEvent() {
    const createUser: CreateUserInput = {
      email: faker.internet.email(),
      password: 'p@ssword1D',
    };

    const createUsersMutation = `
            mutation {
                createUser(createUserInput: ${createInputObject(createUser)}){
                    id
                    email,
                    isActive
                }
            }`;

    const response = await request('http://localhost:3000')
      .post('/graphql')
      .send({
        query: createUsersMutation,
      })
      .expect(200);

    await connection.query(
      `update users set isActive = 1 where id = '${response.body.data?.createUser.id}';`,
    );

    const loginUsersMutation = `
            mutation{
                login(loginUserInput: {email: "${createUser.email}", password: "p@ssword1D"}){
                  accessToken,
                  refreshToken
                }
            }`;

    const login = await request('http://localhost:3000')
      .post('/graphql')
      .send({
        query: loginUsersMutation,
      })
      .expect(200);

    const today = new Date();
    const dates = [
      faker.date.past(),
      today,
      getRandomDateFromDate(today, 3, 20).endDate,
    ];
    const { startDate, endDate } = getRandomDateFromDate(
      getRandomValueFromArray(dates),
    );
    const newAddress: CreateEventAddressInput = {
      countryCode: faker.address.countryCode(),
      label: faker.lorem.sentence(),
      countryName: faker.address.country(),
      state: faker.address.state(),
      county: faker.address.city(),
      city: faker.address.city(),
      postalCode: faker.address.zipCode(),
      district: faker.address.city(),
    };
    const newEvent: CreateEventInput = {
      title: faker.name.title(),
      description: faker.lorem.sentence(),
      type: getRandomNumberBetween(0, 2),
      startDate: startDate,
      endDate: endDate,
      lat: 0,
      lng: 0,
      tags: null,
      eventAddress: newAddress,
      maxParticipants: null,
    };
    const createEventBody = `
            mutation {
                createEvent(createEventInput: ${createInputObject(newEvent)}){
                    id
                    title
                    description
                }
            }`;

    const createEvent = await request('http://localhost:3000')
      .post('/graphql')
      .set({ Authorization: `Bearer ${login.body.data?.login.accessToken}` })
      .send({
        query: createEventBody,
      })
      .expect(200);

    return createEvent.body.data?.createEvent;
  }

  async function createNewUser(createUser: CreateUserInput) {
    const createUsersMutation = `
            mutation {
                createUser(createUserInput: ${createInputObject(createUser)}){
                    id
                    email,
                    isActive
                }
            }`;

    const response = await request('http://localhost:3000')
      .post('/graphql')
      .send({
        query: createUsersMutation,
      })
      .expect(200);

    await connection.query(
      `update users set isActive = 1 where id = '${response.body.data?.createUser.id}';`,
    );

    return response;
  }
});
