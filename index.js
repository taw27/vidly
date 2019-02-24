const express = require('express');// importing required modules
const helmet = require('helmet');
const config = require('config');
const process= require('process');
const app = express();
const mongoose = require('mongoose');
const genresRouter= require('./routes/genres')
const port= process.env.PORT || config.get("Genres.port");

app.use(express.json());//middlewares
app.use(helmet());
mongoose.connect('mongodb://localhost/genres', {useNewUrlParser: true})
  .then(()=> console.log('Connected to MongoDB...'))
  .catch(err=> console.error('could not connect to the database', err));

app.use('/api/genres', genresRouter);

app.listen(port);

