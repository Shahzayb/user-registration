var faker = require('faker');
const User = require('../model/user');

exports.setup = () => {
  for (let i = 0; i < 2500; i++) {
    const name = faker.name.findName();
    const username = faker.name.findName() + ' ' + i;
    const email = faker.internet.email();
    const password = 'dummy hash password';
    const profilePic = faker.internet.avatar();

    User.create({
      name,
      username,
      email,
      password,
      profilePic
    }).catch(() => {});
  }
};
