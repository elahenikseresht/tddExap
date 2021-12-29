const db = require('./db');
beforeAll(async () => await db.connect());
afterEach(async () => await db.clearDatabase());
afterAll(async () => await db.closeDatabase());
const { app } = require('./../app');
const request = require('supertest');

describe('add product', () => {
  it('add product in empty product list', async function () {
    let agent = request(app);
    const res = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 50000 })
      .expect(201);

    expect(res.body.message).toBe('product created');
    const res2 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res2.body.data[0].title).toBe('tea');
    expect(res2.body.data[0].price).toBe(50000);
    expect(res2.body.data.length).toBe(1);
  });

  it('privents from adding a product with price 0', async function () {
    let agent = request(app);
    const res = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 0 })
      .expect(400);

    expect(res.body.message).toBe('price can not be equal or less than 0!');
    const res2 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res2.body.data.length).toBe(0);
  });

  it('privents from adding a product with duplicated title', async function () {
    let agent = request(app);
    const res = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 50000 })
      .expect(201);

    const res2 = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 70000 })
      .expect(400);

    expect(res2.body.message).toBe(
      'a product with this name exists in product list!'
    );
    const res3 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res3.body.data.length).toBe(1);
  });
});

describe('update product', () => {
  it('updates a product', async function () {
    let agent = request(app);
    const res = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 50000 })
      .expect(201);

    const res2 = await agent
      .put(`/api/product/${res.body.data._id}`)
      .set('Accept', 'application/json')
      .send({ title: 'coffie', price: 70000 })
      .expect(200);
    expect(res2.body.message).toBe('product updated');
    const res3 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res3.body.data[0].title).toBe('coffie');
    expect(res3.body.data[0].price).toBe(70000);
    expect(res3.body.data.length).toBe(1);
  });

  it('prevents updating a product with zero price!', async function () {
    let agent = request(app);
    const res = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 50000 })
      .expect(201);

    const res2 = await agent
      .put(`/api/product/${res.body.data._id}`)
      .set('Accept', 'application/json')
      .send({ title: 'coffie', price: 0 })
      .expect(400);
    expect(res2.body.message).toBe('price can not be equal or less than 0!');
    const res3 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res3.body.data[0].title).toBe('tea');
    expect(res3.body.data[0].price).toBe(50000);
    expect(res3.body.data.length).toBe(1);
  });

  it('prevents updating a product with duplicated title', async function () {
    let agent = request(app);
    const res = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 50000 })
      .expect(201);

    const res2 = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'coffie', price: 70000 })
      .expect(201);

    const res3 = await agent
      .put(`/api/product/${res2.body.data._id}`)
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 60000 })
      .expect(400);
    expect(res3.body.message).toBe(
      'a product with this name exists in product list!'
    );

    const res4 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res4.body.data[1].title).toBe('coffie');
    expect(res4.body.data[1].price).toBe(70000);
    expect(res4.body.data.length).toBe(2);
  });

  it('prevents updating a nonexisting product', async function () {
    let agent = request(app);
    const res = await agent
      .put(`/api/product/61cae6f386e11729cf78a1b4`)
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 60000 })
      .expect(400);
    expect(res.body.message).toBe('product did not found!');
    const res2 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res2.body.data.length).toBe(0);
  });
});

describe('get product', () => {
  it('gets all products', async function () {
    let agent = request(app);
    const res = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 50000 })
      .expect(201);

    const res2 = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'coffie', price: 70000 })
      .expect(201);

    const res3 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res3.body.data.length).toBe(2);
  });
  it('gets a product', async function () {
    let agent = request(app);
    const res = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 50000 })
      .expect(201);

    const res2 = await agent
      .get(`/api/product/${res.body.data._id}`)
      .set('Accept', 'application/json')
      .expect(200);

    expect(res2.body.data._id).toBe(res.body.data._id);
    expect(res2.body.data.title).toBe('tea');
    expect(res2.body.data.price).toBe(50000);
  });

  it('prevents getting a nonexisting product!', async function () {
    let agent = request(app);

    const res = await agent
      .get(`/api/product/61caeb70fef7482e39d6e4aa`)
      .set('Accept', 'application/json')
      .expect(400);

    expect(res.body.message).toBe('product did not found!');

    const res2 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res2.body.data.length).toBe(0);
  });
});

describe('delete product', () => {
  it('delete product', async function () {
    let agent = request(app);
    const res = await agent
      .post('/api/product')
      .set('Accept', 'application/json')
      .send({ title: 'tea', price: 50000 })
      .expect(201);

    const res2 = await agent
      .delete(`/api/product/${res.body.data._id}`)
      .set('Accept', 'application/json')
      .expect(204);
    const res3 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res3.body.data.length).toBe(0);
  });

  it('prevents deleting a nonexisting product!', async function () {
    let agent = request(app);

    const res = await agent
      .delete(`/api/product/61caeb70fef7482e39d6e4aa`)
      .set('Accept', 'application/json')
      .expect(400);

    expect(res.body.message).toBe('product did not found!');
    const res2 = await agent
      .get('/api/product')
      .set('Accept', 'application/json')
      .expect(200);
    expect(res2.body.data.length).toBe(0);
  });
});
