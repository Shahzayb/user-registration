const app = require('../index');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');

const User = require('../model/user');
const { createToken } = require('../util/jwt');

const req = supertest(app);

describe('GET /api/user', () => {
  test('search users with pagination', async done => {
    const user1 = new User({
      username: 'shah1',
      name: 'shahzaib',
      email: 'im1@gmail.com',
      password: 'dummy hash password'
    });
    const user2 = new User({
      username: 'shah2',
      name: 'shahzaib2',
      email: 'im2@gmail.com',
      password: 'dummy hash password 2'
    });

    await user1.save();
    await user2.save();

    const res = await req
      .get('/api/user')
      .query({ page: 1 })
      .query({ size: 1 })
      .query({ q: user1.username });

    console.log(res.body);

    expect(res.body[0].username).toBe(user1.username);

    done();
  });

  test('invalid page & size query params are not accepted', async done => {
    const res1 = await req
      .get('/api/user')
      .query({ page: 0 })
      .query({ size: 1 });

    const res2 = await req
      .get('/api/user')
      .query({ page: 2 })
      .query({ size: 1000 });

    expect(res1.status).toBe(422);
    expect(res2.status).toBe(422);
    done();
  });

  test('can get list of all users ( with pagination, and without search query )', async done => {
    const user1 = new User({
      username: 'shah1',
      name: 'shahzaib',
      email: 'im1@gmail.com',
      password: 'dummy hash password'
    });
    const user2 = new User({
      username: 'shah2',
      name: 'shahzaib2',
      email: 'im2@gmail.com',
      password: 'dummy hash password 2'
    });

    await user1.save();
    await user2.save();

    const res1 = await req
      .get('/api/user')
      .query({ page: 1 })
      .query({ size: 1 });

    const res2 = await req
      .get('/api/user')
      .query({ page: 2 })
      .query({ size: 1 });

    const res3 = await req
      .get('/api/user')
      .query({ page: 3 })
      .query({ size: 1 });

    expect(res1.body[0].username).toBe(user2.username);
    expect(res2.body[0].username).toBe(user1.username);
    expect(res3.body.length).toBe(0);
    done();
  });
});

describe('POST /api/user/login', () => {
  test('user can login', async done => {
    const userObj = {
      username: 'shah',
      name: 'shahzaib',
      email: 'imshahzayb@gmail.com',
      password: '12345678'
    };

    const hashPass = await bcrypt.hash(userObj.password, 8);

    await User.create({ ...userObj, password: hashPass });

    const res = await req
      .post('/api/user/login')
      .set('Content-Type', 'application/json')
      .send({ username: userObj.username, password: userObj.password });

    const jwtToken = await createToken({ username: res.body.user.username });

    expect(jwtToken).toEqual(res.body.token);

    done();
  });

  test('user cannot login with invalid username or password', async done => {
    const userObj = {
      username: 'shah',
      name: 'shahzaib',
      email: 'imshahzayb@gmail.com',
      password: '12345678'
    };

    const hashPass = await bcrypt.hash(userObj.password, 8);

    await User.create({ ...userObj, password: hashPass });

    const res = await req
      .post('/api/user/login')
      .set('Content-Type', 'application/json')
      .send({ username: userObj.username, password: 'invalid' });

    expect(res.status).toEqual(401);

    done();
  });
});

describe('POST /api/user', () => {
  test('user can register', async done => {
    const userObj = {
      username: 'Shah',
      name: 'shahZaib',
      email: 'imshahzayb@gmail.com',
      password: '12345678'
    };

    const res = await req
      .post('/api/user')
      .set('Content-Type', 'application/json')
      .send(userObj);

    const user = await User.findById(res.body.user._id, { username: 1 }).lean();

    expect(user.username).toEqual(res.body.user.username);
    done();
  });
});
