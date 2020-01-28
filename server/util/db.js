const mongoose = require('mongoose');

const { MongoMemoryServer } = require('mongodb-memory-server');

const mongod = new MongoMemoryServer();

const dbOpts = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

const uri = await mongod.getConnectionString();

mongoose.connect(uri, dbOpts).catch(err => {
  console.error("couldn't connect to the database", err);
  process.exit(1);
});

const db = mongoose.connection;

db.on('error', err => {
  console.log(err);
});

db.on('open', () => console.log('connected to the database at: ' + uri));
