const functions = require('firebase-functions');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fetch = require('node-fetch');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require('stripe')(
  'sk_test_51IsTukJEAzd2OWuLk3FnSrJQnDxX3VuWZRtUIkCCvEBhK20GOantGHhar8kn1eqtYLtZ1qSX0hvVZ2lwyRWkCl5n002JbZmNr2'
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let reservation;
let loggedInUser;
let carIndexKey;

app.get('/api', (req, res) => {
  console.log('test  test');
  res.json({
    status: 'succeed',
  });
});

// Post routes
app.post('/api/reservations', postReservation);
app.post('/api/order-details', postOrderDetails);
app.post('/api/carIndexKey', postCarIndexKey);
app.post('/api/create-verification-session', postCreateVerificationSession);
app.post('/api/create-checkin', postCreateCheckin);
app.post('/api/create-payment-intent', postCreatePaymentIntent);

// Get routes
app.get('/api/reservations', getReservation);
app.get('/api/carIndexKey', getCarIndexKey);
app.get('/api/order-details', getOrderDetails);
app.get('/api/verification', getVerification);
app.get('/api/deposit', getDeposit);

// Post user info to server when logging in
function postReservation(req, res) {
  console.log('req.body', req.body);
  loggedInUser = req.body;
  console.log(loggedInUser);
  // res.end(JSON.stringify(req.body));
}

// Get logged in user information
function getReservation(req, res) {
  console.log('loggedInUser', loggedInUser);

  setTimeout(() => {
    console.log('all reservations of current user', reservation);
    res.json(loggedInUser);
  }, 1000);
}

// Post specific car obj to server, to fetch on later.
function postOrderDetails(req, res) {
  reservation = req.body;
  console.log('this is the one', req.body);
  res.json(req.body);
}

// Save chosen car index key on server
function postCarIndexKey(req, res) {
  console.log('this is the key index', req.body);

  carIndexKey = req.body;
  res.json(req.body);
}

// Receive chosen car index key
function getCarIndexKey(req, res) {
  console.log('carKeyIndex:', carIndexKey);
  res.json(carIndexKey);
}

// Receives selected car obj from signed in user
function getOrderDetails(req, res) {
  console.log('current reservation', reservation);
  const data = () => {
    if (!reservation) {
    } else {
      return reservation;
    }
  };

  res.json(data());
}

//
function getVerification(req, res) {
  console.log(reservation);
  const data = () => {
    if (!reservation) {
      return 'undefined';
    } else {
      return reservation;
    }
  };

  res.send(data());
}

// Get information
function getDeposit(req, res) {
  console.log(reservation);
  const data = () => {
    if (!reservation) {
      return 'undefined';
    } else {
      return reservation;
    }
  };

  res.send(data());
}

// Handle client-side verification
async function postCreateCheckin(req, res) {
  const { firstName, email, pickUpLocation, pickUpDateTime, reservationID } =
    req.body;

  async function postData(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        Authorization: `Basic ${process.env.WALLET_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  postData(process.env.WALLET_URL, req.body).then((data) => {
    if (!data.errors) {
      console.log(getDate(pickUpDateTime));
      const msg = {
        to: email,
        from: { email: 'europauto2021@outlook.com', name: 'Europauto Checkin' },
        templateId: 'd-d13520409a12422783f1f2bf35983b45',
        dynamicTemplateData: {
          firstName: firstName,
          pickUpLocation: pickUpLocation,
          pickUpDateTime: getDate(pickUpDateTime),
          serialNumber: data.serialNumber,
          reservationID: reservationID,
        },
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent');
        })
        .catch((error) => {
          console.error(error);
        });

      res.send({
        status: '200',
        serialNumber: data.serialNumber,
      });
    } else {
      res.send({
        status: '404',
        errors: data.errors,
      });
    }
  });
}

// Post verification to client
async function postCreateVerificationSession(req, res) {
  const verificationSession = await stripe.identity.verificationSessions.create(
    {
      type: 'document',
      metadata: {
        user_id: '{{USER_ID}}',
      },
    }
  );

  const clientSecret = verificationSession.client_secret;

  console.log('User verification');
  res.end(JSON.stringify(clientSecret));
}

// Stripe code adapted from: https://stripe.com/docs/payments/integration-builder
const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

// Function to handle payments of stripe
async function postCreatePaymentIntent(req, res) {
  console.log(req.body);
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: 'usd',
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}

// Function to calculate specific dates
function getDate(date) {
  const dateTime = date.split(' ');
  const dateElements = dateTime[0].split('-');
  const newDate = `${dateElements[2]}-${dateElements[1]}-${dateElements[0]} ${dateTime[1]}`;
  const dateObject = new Date(newDate);
  const day = dateObject.toLocaleString('nl-NL', { day: 'numeric' });
  const month = dateObject.toLocaleString('nl-NL', { month: 'long' });
  const year = dateObject.toLocaleString('nl-NL', { year: 'numeric' });
  const time = dateObject.toLocaleString('nl-NL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${day} ${month} ${year} om ${time} uur`;
}

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
