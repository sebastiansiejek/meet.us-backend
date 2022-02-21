// eslint-disable-next-line @typescript-eslint/no-var-requires
const faker = require('faker');
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { CreateUserInput } from 'src/users/dto/create-user.input';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { createInputObject } from './helpers/testHelpers';
import { Connection } from 'typeorm';

describe('Users (e2e)', () => {
  let app: INestApplication;
  const createdUsers = [];
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

  it('Create', async () => {
    const createUser: CreateUserInput = {
      email: faker.internet.email(),
      password: 'p@ssword1D',
    };

    const createUsersMutation = ` mutation {
               createUser(createUserInput: ${createInputObject(createUser)}){
                 id,
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

    createdUsers.push(response.body.data?.createUser.id);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data?.createUser.email).toBe(createUser.email);
    expect(response.body.data?.createUser.isActive).toBe(false);
  });

  it('Find all', async () => {
    const findUsersQuery = `query{
            users(first:1){
              page{
                edges{
                  node{
                    id,
                    email
                  }
                }
              }
            }
          }`;
    const response = await request('http://localhost:3000')
      .post('/graphql')
      .send({
        query: findUsersQuery,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data?.users.page.edges.length).toBeGreaterThan(0);
  });

  it('Login if activated', async () => {
    const createUser: CreateUserInput = {
      email: faker.internet.email(),
      password: 'p@ssword1D',
    };
    const newActiveUser = await createNewAndActivateUser(createUser);

    const loginUsersMutation = `mutation{
            login(loginUserInput: {email: "${createUser.email}", password: "p@ssword1D"}){
              accessToken,
              refreshToken
            }
          }`;

    const response = await request('http://localhost:3000')
      .post('/graphql')
      .send({
        query: loginUsersMutation,
      })
      .expect(200);

    const accessTokenLength = response.body.data?.login.accessToken.length;
    const refreshTokenLength = response.body.data?.login.refreshToken.length;

    createdUsers.push(newActiveUser.body.data?.createUser.id);

    expect(response.body.errors).toBeUndefined();
    expect(accessTokenLength).toBeGreaterThan(1);
    expect(refreshTokenLength).toBeGreaterThan(1);
  });

  it('Login if not activated', async () => {
    const createUser: CreateUserInput = {
      email: faker.internet.email(),
      password: 'p@ssword1D',
    };
    const newUserResponse = await createNewUser(createUser);

    const loginUsersMutation = `mutation{
            login(loginUserInput: {email: "${createUser.email}", password: "p@ssword1D"}){
              accessToken,
              refreshToken
            }
          }`;

    const response = await request('http://localhost:3000')
      .post('/graphql')
      .send({
        query: loginUsersMutation,
      })
      .expect(200);

    createdUsers.push(newUserResponse.body.data?.createUser.id);

    expect(response.body.errors).toBeDefined();
  });

  async function createNewUser(createUser: CreateUserInput) {
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

    return response;
  }
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
    return response;
  }
});
