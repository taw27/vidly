const express= require('express');//importing required modules
const Joi= require('joi')
const process= require('process');

const app= express();
const port= process.env.PORT || 3000;

const movieGenres=[{id:1, genre: 'action'},//dummy data
{id:2, genre:'comedy'},
{ide:3, genre: 'thriller'}
];

app.listen(port);
