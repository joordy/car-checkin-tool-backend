# **Car Checkin Tool — Backend**

We, [Jordy Fronik](https://github.com/joordy), [Lars Ruijs](https://github.com/lars-ruijs) & [Guus Maij](https://github.com/tsjuusmei) have made an application to check-in reservations for rental cars online. Because of this, the user will only have to physically pick-up the keys for the car, and will shorten the queue at the rental place.

![Car Checkin Tool screens](https://user-images.githubusercontent.com/48051912/122197009-0fc74300-ce98-11eb-903f-2cf45c2dbb62.jpg)

## 🚀 **Live demo**

You can visit the project [here](https://car-checkin-tool.netlify.app/)

## 📄 **Debrief**

A reservation is, most of the time, made well ahead of the rental date. Until now, the user always has to check-in physically at the location of the rental, which easily costs about 15 minutes per user.

Create a digital check-in process for the rental service, so that there is only little time needed to physically pick up the rental car. The check-in process consists of: user login, checking in a reservation, confirm the identity and driver's license and create a reservation for the deposit on a creditcard.

## ✍🏼 **Design Challenge**

How can we ensure that customers, that reserved a car at the rental, can easily check-in online, so that they can quickly pick up the reserved car at the relevant location.

## 🔦 **Features**

- User login
- Overview of reservations
- Checking in a reservation
- Confirming identity and driver's license
- Reserve deposit on a creditcard

## 🛠 **API / Externals**

<details style="margin: 1em 0;">
  <summary style="margin: 1em 0;">Stripe Identity API</summary>

To confirm the identity and driver's license of the user(s), we use [Stripe Identity API](https://stripe.com/docs/identity). This service easily can easily the identity and driver's license for us.

</details>

<details style="margin: 1em 0;">
  <summary style="margin: 1em 0;">Stripe API</summary>

To assure the reserve deposit on a creditcard, we use [Stripe API](https://stripe.com/docs/api).

</details>

<details style="margin: 1em 0;">
  <summary style="margin: 1em 0;">Passslot</summary>

To add a checked-in reservation to a user's Apple Wallet, we use [Passslot](https://www.passslot.com/developer/api/resources).

</details>

## 📊 **Database**

For the usage of the database, we chose [Supabase](https://supabase.io/). This is a very easy to set up database, which a very nice and easy documentation. Therefore this database seemed really easy to use, and we chose to use this for our project.

For this project we needed to store the users and their reservations, with all of the associated information:

<details style="margin: 1em 0;">
  <summary style="margin: 1em 0;"><strong>Dataset</strong></summary>

```js
const user = {
  firstName: 'Kelly ',
  lastName: 'De Jong',
  email: 'kellydejong@gmail.com',
  password: 'Welkom123',
  phoneNumber: '+31 6 12345678',
  birthDate: '01-01-1997',
  userID: '3ad91773-3c2f-4907-b816-ae7c95c56077',
  carResOne: {
    class: 'Electric',
    qrCode: true,
    carImage: 'https://linkgoestoimage.png',
    checkedIn: false,
    driverOne: {
      role: 'hoofdbestuurder',
      driver: 'Kelly de Jong',
      method: '',
      verified: false,
    },
    driverTwo: {
      role: 'extra',
      driver: 'Lars Ruijs',
      method: '',
      verified: false,
    },
    otherInfo: {
      freeKM: 600,
      deposit: 500,
      ownRisk: 450,
      priceExtraKM: 0.3,
    },
    rentPrice: 600,
    handInDate: '29-06-2921',
    handInTime: '17:00:00',
    pickUpDate: '19-06-2021',
    pickUpTime: '09:00:00',
    extraDriver: 0,
    paidDeposit: {
      paid: true,
      method: 'card',
    },
    lowerOwnRisk: false,
    orderDetails: true,
    reservationID: 'bcf67557-43d7-4b64-9e41-927be4c67d48',
    handInLocation: 'Amsterdam, Overtoom',
    pickUpLocation: 'Amsterdam, Overtoom',
    walletSerialNumber: '09c37531-01d7-47bb-9a6a-51f51781de28',
    verificationProcess: false,
  },
  carResTwo: {
    carImage: 'https://linkgoestoimage.png',
    reservationID: 'af634c1f-a204-4129-bdbe-0138b844f1f2',
    checkedIn: false,
    pickUpLocation: 'Amsterdam, Overtoom',
    pickUpDate: '16-06-2021',
    pickUpTime: '09:00:00',
    handInLocation: 'Amsterdam, Overtoom',
    handInDate: '18-06-2921',
    handInTime: '17:00:00',
    class: 'C',
    rentPrice: 600,
    extraDriver: 0,
    lowerOwnRisk: false,
    otherInfo: {
      ownRisk: 450,
      deposit: 500,
      freeKM: 600,
      priceExtraKM: 0.3,
    },
    orderDetails: false,
    driverOne: {
      driver: 'Kelly de Jong',
      role: 'hoofdbestuurder',
      method: 'location',
      verified: false,
    },
    verificationProcess: false,
    paidDeposit: {
      method: 'location',
      paid: false,
    },
    qrCode: Boolean,
    walletSerialNumber: 'String',
  },
  carResThree: {
    carImage: 'https://linkgoestoimage.png',
    reservationID: '35063e58-478d-472b-9eb5-fcfe877e07a1',
    checkedIn: false,
    pickUpLocation: 'Amsterdam, Overtoom',
    pickUpDate: '18-06-2021',
    pickUpTime: '09:00:00',
    handInLocation: 'Amsterdam, Overtoom',
    handInDate: '20-06-2921',
    handInTime: '17:00:00',
    class: 'A',
    rentPrice: 600,
    extraDriver: 0,
    lowerOwnRisk: false,
    otherInfo: {
      ownRisk: 450,
      deposit: 500,
      freeKM: 600,
      priceExtraKM: 0.3,
    },
    orderDetails: false,
    driverOne: {
      driver: 'Kelly de Jong',
      role: 'hoofdbestuurder',
      method: 'location',
      verified: false,
    },
    driverTwo: {
      driver: 'Lars Ruijs',
      role: 'extra',
      method: 'location',
      verified: false,
    },
    verificationProcess: false,
    paidDeposit: {
      method: 'location',
      paid: false,
    },
    qrCode: Boolean,
    walletSerialNumber: 'String',
  },
};
```

</details>

## 🖥 **Tech-stack**

### **Front-end**

The application is built in [React.js](https://reactjs.org/). This is a component based framework, where we can easily work in together.
For every feature or adjustment, we worked in branches and made pull requests of every small change or feature add-on. Every pull request must be reviewed by at least 1 of the other team members before it is able to merge onto the `development` branch.

We also used a method of component based programming. The components can then be made in various ways. We have used the [Atomic Webdesign](https://bradfrost.com/blog/post/atomic-web-design/) method for this. By using this, we split up every bit of code in `atoms`, `molecules`, `organisms` and `templates`. By doing it this way, we can reuse the components, avoiding repetition, and program DRY in this way.

We also use [`prettier`](https://prettier.io/) as code formatter, which also uses [`eslint`](https://eslint.org/) to lint the code. This will save a lot of discussion within code reviews, because it creates the same layout for the code on every save the creator makes.

### **Backend**

We wrote the backend in an external repository. This is built using Firebase Cloud Functions, and we can contact the backend with the help of an API fetch.

The repository can be viewed [here: Car Checkin Tool Backend](https://github.com/joordy/car-checkin-tool-backend)

## ⚙️ **Installation**

_To edit this project, Node (nvm) and Git are required on your machine_

### **Edit project**

#### **Clone the repo**

```
git clone https://github.com/joordy/car-checkin-tool-backend.git
```

#### **Navigate to Functions folder**

```
cd functions/
```

#### **Install the project**

```
npm install
```

#### **Run the developmment area**

```
npm run serve
```

### **Build project**

#### **Export the project**

```
npm run deploy
```

### **And deploy the build folder on your host** 🎉🎉

## 📦 **NPM Packages**

### **Dev Dependencies**

- [Eslint](https://www.npmjs.com/package/eslint)
- [Prettier](https://www.npmjs.com/package/prettier)
- [Styled Components](https://www.npmjs.com/package/styled-components)

### **Dependencies**

- [@stripe/react-stripe-js](https://www.npmjs.com/package/@stripe/react-stripe-js)
- [@stripe/stripe-js](https://www.npmjs.com/package/@stripe/stripe-js)
- [@supabase/supabase-js](https://www.npmjs.com/package/@supabase/supabase-js)
- [Axios](https://www.npmjs.com/package/axios)
- [React-redux](https://www.npmjs.com/package/react-redux)
- [Redux](https://www.npmjs.com/package/redux)
- [Stripe](https://www.npmjs.com/package/stripe)

## **License**

This is a repository which is licensed as [MIT](). Developed by Jordy Fronik, Guus Maij & Lars Ruijs ©️ 2021.
