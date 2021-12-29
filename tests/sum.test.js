const db = require('./db');
beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());
const sum = require('../sum');

it('First Test', async function () {
  const result = await sum(2, 2);
  expect(result).toBe(4);
});
