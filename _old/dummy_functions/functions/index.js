const functions = require('firebase-functions');
require('dotenv').config();
const express = require('express');
const app = express();
const fetch = require('node-fetch');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const stripe = require('stripe')(
  'sk_test_51IsTukJEAzd2OWuLk3FnSrJQnDxX3VuWZRtUIkCCvEBhK20GOantGHhar8kn1eqtYLtZ1qSX0hvVZ2lwyRWkCl5n002JbZmNr2'
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Get routes
app.get('/api', getApi);
app.get('/api/reservations', getReservation);
app.get('/api/carIndexKey', getCarIndexKey);
app.get('/api/order-details', getOrderDetails);
app.get('/api/verification', getVerification);
app.get('/api/deposit', getDeposit);

// Post routes
app.post('/api/reservations', postReservation);
app.post('/api/order-details', postOrderDetails);
app.post('/api/carIndexKey', postCarIndexKey);
app.post('/api/create-verification-session', postCreateVerificationSession);
app.post('/api/create-checkin', postCreateCheckin);
app.post('/api/create-payment-intent', postCreatePaymentIntent);

let loggedInUser;
let carIndexKey;
let reservation;

////////////////////////////////////////
//             GET ROUTES             //
////////////////////////////////////////

function getApi(req, res) {
  console.log('test  test');
  res.json({
    status: 'succeed',
  });
}

function getReservation(req, res) {
  // Get logged in user information
  console.log('loggedInUser', loggedInUser);

  setTimeout(() => {
    res.json(loggedInUser);
  }, 1000);
}

function getCarIndexKey(req, res) {
  // Receive chosen car index key
  console.log('carKeyIndex:', carIndexKey);
  res.json(carIndexKey);
}

function getOrderDetails(req, res) {
  // Receives selected car obj from signed in user
  console.log('current reservation', reservation);
  const data = () => {
    if (!reservation) {
      console.log('not found');
    } else {
      return reservation;
    }
  };

  res.json(data());
}

function getVerification(req, res) {
  //
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

function getDeposit(req, res) {
  // Get information
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

////////////////////////////////////////
//            POST ROUTES             //
////////////////////////////////////////

function postReservation(req, res) {
  // Post user info to server when logging in
  loggedInUser = req.body;
  console.log('req.body', req.body);
  console.log('loggedInUser', loggedInUser);
  res.json(loggedInUser);
}

function postOrderDetails(req, res) {
  // Post specific car obj to server, to fetch on later.
  reservation = req.body;
  console.log('this is the one', req.body);
  res.json(req.body);
}

function postCarIndexKey(req, res) {
  // Save chosen car index key on server
  console.log('this is the key index', req.body);
  carIndexKey = req.body;
  res.json(req.body);
}

async function postCreateCheckin(req, res) {
  // Handle client-side verification
  const { firstName, email, pickUpLocation, pickUpDateTime, reservationID } = req.body;

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

async function postCreateVerificationSession(req, res) {
  // Post verification to client
  const verificationSession = await stripe.identity.verificationSessions.create({
    type: 'document',
    metadata: {
      user_id: '{{USER_ID}}',
    },
  });

  const clientSecret = verificationSession.client_secret;

  console.log('User verification');
  res.end(JSON.stringify(clientSecret));
}

const calculateOrderAmount = () => {
  // Stripe code adapted from: https://stripe.com/docs/payments/integration-builder
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 1400;
};

async function postCreatePaymentIntent(req, res) {
  // Function to handle payments of stripe
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

function getDate(date) {
  // Function to calculate specific dates
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

////////////////////////////////////////
//              Export                //
////////////////////////////////////////

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
