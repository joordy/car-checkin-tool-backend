const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const express = require('express');
const app = express();
const fetch = require('node-fetch');
const sgMail = require('@sendgrid/mail');
const moment = require('moment');
const cors = require('cors');
sgMail.setApiKey(functions.config().sendgrid.key);
const stripe = require('stripe')(
  'sk_test_51IsTukJEAzd2OWuLk3FnSrJQnDxX3VuWZRtUIkCCvEBhK20GOantGHhar8kn1eqtYLtZ1qSX0hvVZ2lwyRWkCl5n002JbZmNr2'
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST'],
  })
);

// Get routes
app.get('/api', getApi);
app.get('/api/reservations', getReservation);
app.get('/api/carIndexKey', getCarIndexKey);
app.get('/api/order-details', getOrderDetails);
app.get('/api/verification', getVerification);
app.get('/api/deposit', getDeposit);

// Post routes
app.post('/api', postApi);
app.post('/api/reservations', postReservation);
app.post('/api/order-details', postOrderDetails);
app.post('/api/carIndexKey', postCarIndexKey);
app.post('/api/testEnv', postTestEnv);
app.post('/api/payMethod', postPayMethod);
app.post('/api/create-verification-session', postCreateVerificationSession);
app.post('/api/create-checkin', postCreateCheckin);
app.post('/api/create-payment-intent', postCreatePaymentIntent);

// //////////////////////////////////////
//             GET ROUTES             //
// //////////////////////////////////////

async function getApi(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  const cityRef = db.collection('server').doc('loggedInUser');
  const doc = await cityRef.get();
  console.log(doc.data());
  res.end(
    JSON.stringify({
      status: 'succeeaad',
    })
  );
}

async function getReservation(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  setTimeout(async () => {
    const cityRef = db.collection('server').doc('loggedInUser');
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      res.json(doc.data());
    }
  }, 100);
}

function getCarIndexKey(req, res) {
  // Receive chosen car index key
  res.set('Access-Control-Allow-Origin', '*');
  setTimeout(async () => {
    const cityRef = db.collection('server').doc('carIndexKey1');
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      res.json(doc.data());
    }
  }, 100);
}

function getOrderDetails(req, res) {
  // Receives selected car obj from signed in user
  res.set('Access-Control-Allow-Origin', '*');
  setTimeout(async () => {
    const cityRef = db.collection('server').doc('reservation');
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      res.json(doc.data());
    }
  }, 100);
}

function getVerification(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  setTimeout(async () => {
    const cityRef = db.collection('server').doc('reservation');
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      res.json(doc.data());
    }
  }, 100);
}

function getDeposit(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  setTimeout(async () => {
    const cityRef = db.collection('server').doc('reservation');
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log('No such document!');
    } else {
      res.json(doc.data());
    }
  }, 100);
}

// //////////////////////////////////////
//            POST ROUTES             //
// //////////////////////////////////////

async function postApi(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  const cityRef = db.collection('server').doc('loggedInUser');
  const doc = await cityRef.get();
  console.log(doc.data());
  res.json({
    status: 'succeeaad',
  });
}

async function postReservation(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  await db.collection('server').doc('loggedInUser').delete();
  await db.collection('server').doc('loggedInUser').set(req.body);
  console.log('DIT  IS DE JUISTE DAAAATA', req.body.firstName);
  console.log('hi');
  res.send('success');
}

async function postOrderDetails(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  await db.collection('server').doc('reservation').delete();
  await db.collection('server').doc('reservation').set(req.body);
  console.log('post this detail', req.body);
  // Post specific car obj to server, to fetch on later.
  // console.log('this is the one', req.body);
  res.json('success');
}

async function postCarIndexKey(req, res) {
  // Save chosen car index key on server
  res.set('Access-Control-Allow-Origin', '*');
  await db.collection('server').doc('carKeyIndex').delete();
  await db.collection('server').doc('carKeyIndex ').set(req.body);
  res.json('success');
}

async function postTestEnv(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.send('order details succesfully submitted');
}

async function postPayMethod(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.body.carkey === 0) {
    await db
      .collection('server')
      .doc('loggedInUser')
      .update({ 'carResOne.paidDeposit.paid': req.body.paid, 'carResOne.paidDeposit.method': req.body.method });
    await db
      .collection('server')
      .doc('reservation')
      .update({ paidDeposit: { paid: req.body.paid, method: req.body.method } });
  } else if (req.body.carkey === 1) {
    await db
      .collection('server')
      .doc('loggedInUser')
      .update({ 'carResTwo.paidDeposit.paid': req.body.paid, 'carResTwo.paidDeposit.method': req.body.method });
    await db
      .collection('server')
      .doc('reservation')
      .update({ paidDeposit: { paid: req.body.paid, method: req.body.method } });
  } else if (req.body.carkey === 3) {
    await db
      .collection('server')
      .doc('loggedInUser')
      .update({ 'carResThree.paidDeposit.paid': req.body.paid, 'carResThree.paidDeposit.method': req.body.method });
    await db
      .collection('server')
      .doc('reservation')
      .update({ paidDeposit: { paid: req.body.paid, method: req.body.method } });
  }
  res.json('success');
}

async function postCreateCheckin(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  console.log('REQ BODY: ', req.body);

  postData('https://api.passslot.com/v1/templates/5119469477953536/pass', req.body).then((data) => {
    if (!data.errors) {
      // Create message
      const message = createMessage(req.body, data.serialNumber);
      // Send e-mail with Sendgrid
      sendEmail(message);
      // Send status
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

async function postData(url, data) {
  console.log('DEZE URL HEB IK NODIG', url);

  const key = functions.config().wallet.key;
  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      Authorization: `Basic ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

function createMessage(userObject, serialNumber) {
  const { firstName, email, pickUpLocation, pickUpDateTime, reservationID } = userObject;

  // Create message object
  const msg = {
    to: email,
    from: { email: 'europauto2021@outlook.com', name: 'Europauto Checkin' },
    templateId: 'd-d13520409a12422783f1f2bf35983b45',
    dynamicTemplateData: {
      firstName: firstName,
      pickUpLocation: pickUpLocation,
      pickUpDateTime: getDate(pickUpDateTime),
      serialNumber: serialNumber,
      reservationID: reservationID,
    },
  };

  return msg;
}

function sendEmail(message) {
  // Send message via Sendgrid
  sgMail
    .send(message)
    .then(() => {
      return 'succes';
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
}

// async function postCreateCheckin(req, res) {
//   // Handle client-side verification
//   const { firstName, email, pickUpLocation, pickUpDateTime, reservationID } = req.body;

//   async function postData(url, data) {
//     const response = await fetch(url, {
//       method: 'POST',
//       mode: 'cors',
//       credentials: 'same-origin',
//       headers: {
//         Authorization: `Basic ${process.env.WALLET_SECRET}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });
//     return response.json();
//   }

//   postData(process.env.WALLET_URL, req.body).then((data) => {
//     if (!data.errors) {
//       console.log(getDate(pickUpDateTime));
//       const msg = {
//         to: email,
//         from: { email: 'europauto2021@outlook.com', name: 'Europauto Checkin' },
//         templateId: 'd-d13520409a12422783f1f2bf35983b45',
//         dynamicTemplateData: {
//           firstName: firstName,
//           pickUpLocation: pickUpLocation,
//           pickUpDateTime: getDate(pickUpDateTime),
//           serialNumber: data.serialNumber,
//           reservationID: reservationID,
//         },
//       };
//       sgMail
//         .send(msg)
//         .then(() => {
//           console.log('Email sent');
//         })
//         .catch((error) => {
//           console.error(error);
//         });

//       res.send({
//         status: '200',
//         serialNumber: data.serialNumber,
//       });
//     } else {
//       res.send({
//         status: '404',
//         errors: data.errors,
//       });
//     }
//   });
// }

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

// function getDate(date) {
//   // Function to calculate specific dates
//   const dateTime = date.split(' ');
//   const dateElements = dateTime[0].split('-');
//   const newDate = `${dateElements[2]}-${dateElements[1]}-${dateElements[0]} ${dateTime[1]}`;
//   const dateObject = new Date(newDate);
//   const day = dateObject.toLocaleString('nl-NL', { day: 'numeric' });
//   const month = dateObject.toLocaleString('nl-NL', { month: 'long' });
//   const year = dateObject.toLocaleString('nl-NL', { year: 'numeric' });
//   const time = dateObject.toLocaleString('nl-NL', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false,
//   });

//   return `${day} ${month} ${year} om ${time} uur`;
// }

function getDate(date) {
  moment.locale('nl');
  const momentDate = moment(date, 'DD-MM-YYYY hh:mm');

  return `${momentDate.format('D MMMM YYYY')} om ${momentDate.format('hh:mm')} uur`;
}

// //////////////////////////////////////
//              Export                //
// //////////////////////////////////////

exports.app = functions.https.onRequest(app);
