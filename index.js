const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./old/routes/handler.js');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 8000; // backend routing port

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routesHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// const corsMiddleware = require('./cors/index.js');
// const cors = require('cors');

// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://europcar.netlify.app',
//   'http://europcar.netlify.app',
//   'https://car-checkin-tool.vercel.app',
//   'http://car-checkin-tool.vercel.app',
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // allow requests with no origin
//       // (like mobile apps or curl requests)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         var msg = 'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
//         console.log('bla');
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//   })
// );

// app.use(express.static(path.resolve(__dirname, '../client/build')));
