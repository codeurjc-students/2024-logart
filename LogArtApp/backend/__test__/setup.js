const { connect, closeDatabase, clearDatabase } = require('./db');

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
