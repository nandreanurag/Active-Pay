// const path = require('path');   //file red,upload
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');  // to parse json-object vice cersa
const mongoose = require('mongoose');    // active object relation mapping    // file read,upload in windows
const { v4: uuidv4 } = require('uuid');  // file read,upload in windows
// importing routes
const authRoute = require('./routes/auth.js');
const cardRoute = require('./routes/card.js');
const rewardRoute = require('./routes/reward.js')
// const rewardRoute = require('./routes/reward');

const app = express();
app.use(cors())
app.use(bodyParser.json()); 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization');
  next();
});




// Routes middlewares
app.use('/api/user', authRoute);
app.use('/api/cards', cardRoute);
app.use('/api/rewards', rewardRoute);

// app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message});
});

mongoose
  .connect(
    'mongodb+srv://anurag_nandre:anuragnandre@cluster0.cgdmlj0.mongodb.net/activepay?retryWrites=true&w=majority'
  )
  .then(result => {
    app.listen(8082);
  })
  .catch(err => console.log(err));
