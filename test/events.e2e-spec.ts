// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateEventInput } from 'src/events/dto/create-event.input';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createInputObject } from './helpers/testHelpers';
import { eventType, state } from 'src/events/entities/event.entity';

describe('Events (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Find all', () => {
    const findEventsQuery = `query {
      events {
        title,
        eventId
      }
    }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: findEventsQuery,
      })
      .expect(({ body }) => {
        const { data } = body;
        const { events } = data;
        expect(events.length).toBeGreaterThan(0);
      })
      .expect(200);
  });

  it('Create', () => {
    const sampleEvent: CreateEventInput = {
      title: faker.firstName.firstName(),
      description: faker.productDescription.productDescription(),
      eventType: eventType.Party,
      state: state.Draft,
    };

    const createEventsMutation = `mutation {
      createEvent(createEventInput: ${createInputObject(sampleEvent)}) {
        eventId,
      }
    }`;

    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: createEventsMutation,
      })
      .expect(200);
  });
});
