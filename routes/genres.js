const express= require('express');
const router=express.Router();
const Joi= require('joi');
const Genre = require('../models/Genre');

router.get('/', (req, res)=>{
    return res.send(getGenrebyName(''));
});

router.get('/:genreName', (req, res)=>{
    const genre= getGenrebyName(req.params.genreName);
    return genre? res.send(genre): res.status(404).send("Genre Not Found");
});

router.post('/',(req, res)=>{
    const {error, value} = validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    if(getGenrebyName(value.name)) return res.status(400).send('Genre already exists');
    else {
    const newGenre={ name: value.name, movies: value.movies}
    return res.status(200).send(insertGenre(newGenre));
    }
});

router.put('/:genreName',(req, res)=>{
    const {error, value} = validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const genre= getGenrebyName(req.params.genreName);
    if(!genre) return res.status(400).send('Genre does not exist');

   updateGenre(value)

    return  res.status(200).send(genre);
});

async function getGenrebyName(genreName) {
    try{
    let result = await Genre
    .find({ name: genreName.toLowerCase() });
    }catch(err){
        return null;
    }
    return result; 
}

async function updateGenre(genre){

    try{
        const genre = getGenrebyName(genre.name);
    return await insertGenre(genre);
    }catch(err){
        return err.errors['name'].message;
    }
}

async function insertGenre(genre){

    try{
    return await new Genre(genre).save();
    }catch(err){
        return err.errors['name'].message;
    }
}

function validateGenre(genreName){
    const schema= Joi.object().keys({
    name: Joi.string().min(3).required()
    });
    return Joi.validate(genreName, schema);
}

module.exports= router;