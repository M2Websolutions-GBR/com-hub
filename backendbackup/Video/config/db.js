const mongoose = require('mongoose');
require('dotenv').config();

module.exports = () => {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  mongoose.connection.on('connected', () => console.log('Connected to Mongodb'));
  mongoose.connection.on('error', (err) => console.error(`Mongodb connection error: ${err}`));
};