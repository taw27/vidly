const express= require('express');// importing required modules
const helmet= require('helmet');
const config= require('config');
const process= require('process');
const app= express();
const genresRouter= require('./routes/genres')
const port= process.env.PORT || config.get("Genres.port");

app.use(express.json());
app.use(helmet());
app.use('/genres', genresRouter);
app.listen(port);

