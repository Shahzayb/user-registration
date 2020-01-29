const bcrypt = require('bcryptjs');

const User = require('../model/user');
const validators = require('./user.validator');
const { createToken } = require('../util/jwt');

exports.postUser = [
  validators.postUser,
  async (req, res) => {
    try {
      const [password, token] = await Promise.all([
        bcrypt.hash(req.body.password, 8),
        createToken({ username: req.body.username })
      ]);

      const user = await User.create({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password
      });

      res.status(201).json({
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];

exports.loginUser = [
  validators.loginUser,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username })
        .select('+username +name +email +password')
        .lean();

      if (!user) {
        return res.status(401).send('invalid username or password');
      }

      const isEqual = await bcrypt.compare(password, user.password);

      if (!isEqual) {
        return res.status(401).send('invalid username or password');
      }

      const token = await createToken({ username });

      res.json({
        user: {
          _id: user._id,
          username: user.username,
          name: user.name,
          email: user.email
        },
        token
      });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];

exports.getUser = [
  validators.getUser,
  async (req, res) => {
    try {
      const { page, size, q } = req.query;
      const skip = (page - 1) * size;

      let search = {};
      let sort = { _id: -1 };
      const project = { username: 1, name: 1, _id: 1 };

      if (q) {
        search = { $text: { $search: q } };
        sort = { score: { $meta: 'textScore' } };
        project.score = { $meta: 'textScore' };
      }

      const users = await User.find(search, project)
        .sort(sort)
        .skip(skip)
        .limit(size);

      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  }
];
