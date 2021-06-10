const cors = require('cors');

const corsOptions = {
  // origin: 'http://localhost:3000',
  // origin: 'https://europcar.netlify.app',
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionSuccessStatus: 200,
};

module.exports = cors(corsOptions);
