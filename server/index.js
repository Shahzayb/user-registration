const express = require('express');
const cors = require('cors');

const app = express();

// dev config setup
require('./config/dev').setup(app.get('env'));

// require middlewares
const logger = require('morgan');

// require routes
const userRoute = require('./route/user');

// mount middlewares
app.use(cors());
app.use(logger('combined'));
app.use(express.json());

// mount routes
app.use('/api/user', userRoute);

if (app.get('env') !== 'test') {
  // start db server
  require('./util/db');

  // start node server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}

module.exports = app;
