// eslint-disable-next-line @typescript-eslint/no-var-requires
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createInputObject } from './helpers/testHelpers';
import { CreateUserInput } from '../src/users/dto/create-user.input';
import { Connection } from 'typeorm';
import { CreateEventInput } from '../src/events/dto/create-event.input';
import faker = require('faker');
import {
  getRandomDateFromDate,
  getRandomNumberBetween,
  getRandomValueFromArray,
} from '../utils/getRandoms';
import { CreateEventAddressInput } from '../src/events/dto/create-event-address.input';

describe('Events (e2e)', () => {
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

  afterAll(async () => {
    await app.close();
  });

  it('Find all', async () => {
    const findEventsQuery = `query{
            events(first:1){
              page{
                edges{
                  node{
                    id,
                    title,
                  }
                }
              }
            }
          }`;
    const response = await request('http://localhost:3000')
      .post('/graphql')
      .send({
        query: findEventsQuery,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data?.events.page.edges.length).toBeGreaterThan(0);
  });

  it('Create if not logged in', async () => {
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

    const response = await request('http://localhost:3000')
      .post('/graphql')
      .send({
        query: createEventBody,
      })
      .expect(200);

    expect(response.body.errors).toBeDefined();
  });

  it('Create if logged in', async () => {
    const createUser: CreateUserInput = {
      email: faker.internet.email(),
      password: 'p@ssword1D',
    };
    const newActiveUser = await createNewAndActivateUser(createUser);

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

    const response = await request('http://localhost:3000')
      .post('/graphql')
      .set({
        Authorization: `Bearer ${newActiveUser.body.data?.login.accessToken}`,
      })
      .send({
        query: createEventBody,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();

    expect(response.body.data?.createEvent.title).toBe(newEvent.title);
    expect(response.body.data?.createEvent.description).toBe(
      newEvent.description,
    );
  });

  it('Find one', async () => {
    const createUser: CreateUserInput = {
      email: faker.internet.email(),
      password: 'p@ssword1D',
    };

    const newActiveUser = await createNewAndActivateUser(createUser);

    const createEvent = await createNewEvent(newActiveUser);

    const findUsersQuery = `query{
            event(id:"${createEvent.id}"){
              title,
              description
            }
          }`;
    const response = await request('http://localhost:3000')
      .post('/graphql')
      .send({
        query: findUsersQuery,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data?.event.title).toBe(createEvent.title);
    expect(response.body.data?.event.description).toBe(createEvent.description);
  });

  async function createNewAndActivateUser(createUser: CreateUserInput) {
    const createUsersMutation = ` mutation {
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

    const loginUsersMutation = `mutation{
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

    return login;
  }
  async function createNewEvent(newActiveUser: any) {
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

    const response = await request('http://localhost:3000')
      .post('/graphql')
      .set({
        Authorization: `Bearer ${newActiveUser.body.data?.login.accessToken}`,
      })
      .send({
        query: createEventBody,
      })
      .expect(200);

    return response.body.data?.createEvent;
  }
});
