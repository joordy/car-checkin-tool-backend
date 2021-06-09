const cors = require('cors');

const corsOptions = {
  // origin: 'http://localhost:3000',
  origin: 'https://europcar.netlify.app',
  optionSuccessStatus: 200,
};

module.exports = cors(corsOptions);
