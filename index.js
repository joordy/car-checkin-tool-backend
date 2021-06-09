require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const routesHandler = require('./routes/handler.js');
// const corsMiddleware = require('./cors/index.js');
const cors = require('cors');

// const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000; // backend routing port

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
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', routesHandler);

// app.use(express.static(path.resolve(__dirname, '../client/build')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

console.log('hello world');
