const app = require('../index');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');

const User = require('../model/user');
const { createToken, createTokenForResetPassword } = require('../util/jwt');

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

describe('POST /api/user/reset-password', () => {
  test('user can reset password', async done => {
    const userObj = {
      username: 'shah',
      name: 'shahzaib',
      email: 'imshahzayb@gmail.com',
      password: 'dummy hashed password'
    };
    const newPassword = 'new password';

    const user = new User(userObj);

    await user.save();

    const resetToken = createTokenForResetPassword(user);

    const res = await req
      .post(`/api/user/${user._id}/reset-password`)
      .query({ token: resetToken })
      .send({ password: newPassword });

    await User.findById(res.body.user._id, { password: 1 })
      .lean()
      .then(user => {
        return bcrypt.compare(newPassword, user.password);
      })
      .then(isCorrect => {
        expect(isCorrect).toBe(true);
      });

    done();
  });

  test('user cannot reset password with invalid token', async done => {
    const userObj = {
      username: 'shah',
      name: 'shahzaib',
      email: 'imshahzayb@gmail.com',
      password: 'dummy hashed password'
    };
    const newPassword = 'new password';

    const user = new User(userObj);

    await user.save();

    const resetToken = createTokenForResetPassword({
      password: 'asfsfs',
      createdAt: new Date().toISOString(),
      _id: user._id
    });

    const res = await req
      .post(`/api/user/${user._id}/reset-password`)
      .query({ token: resetToken })
      .send({ password: newPassword });

    expect(res.status).toBe(401);

    done();
  });
});
