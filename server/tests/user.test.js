const app = require('../index');
const supertest = require('supertest');

const User = require('../model/user');
const { createToken } = require('../util/jwt');

const req = supertest(app);

test('user can register', async done => {
  let userObj = {
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
