const app = require('../index');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');

const User = require('../model/user');
const { createToken } = require('../util/jwt');

const req = supertest(app);

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
