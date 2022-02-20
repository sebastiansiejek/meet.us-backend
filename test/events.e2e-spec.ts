// eslint-disable-next-line @typescript-eslint/no-var-requires
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

describe('Events (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Create', () => {
    // return request(app.getHttpServer())
    //     .post('/graphql')
    //     .send({
    //         query: createEventsMutation,
    //     })
    //     .expect(200);
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
});
