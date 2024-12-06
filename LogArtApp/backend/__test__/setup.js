const { connect, closeDatabase, clearDatabase } = require('./dbtest');

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

jest.setTimeout(30000);
