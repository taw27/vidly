const express= require('express');
const router=express.Router();
const Joi= require('joi');
const Genre = require('../models/Genre');

router.get('/', async (req, res)=>{
    const genre = await Genre.find();
    return res.send(genre);
});

router.get('/:genreName', async (req, res)=>{
    const genre= await getGenrebyName(req.params.genreName);
    console.log(genre);
    return genre.length>0 ? res.send(genre): res.status(404).send("Genre Not Found");
});

router.post('/',async (req, res)=>{
    const {error, value} = validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    const genre = await getGenrebyName(value.name);
    if(genre.length>0) return res.status(400).send('Genre already exists');
    else {
    const newGenre = await insertGenre({ name: value.name, movies: value.movies});
    return res.status(200).send(newGenre);
    }
});

router.put('/:genreName',async (req, res)=>{
    const {error, value} = validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const genre= await getGenrebyName(value.name);
    console.log(genre);
    if(genre.length===0) return res.status(400).send('Genre does not exist');
    
    const updatedGenre = await updateGenre(value)

    return  res.status(200).send(updatedGenre);
});

async function getGenrebyName(genreName) {
    try{
    return await Genre
    .find({ name: genreName.toLowerCase() });
    }catch(err){
       console.log(err);
    }
}

async function updateGenre(genre){
    try{
       let retreivedGenre =  await getGenrebyName(genre.name);

       retreivedGenre[0].movies = genre.movies;
       retreivedGenre[0].name = genre.name;
       return await retreivedGenre[0].save();

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
    name: Joi.string().min(3).required(),
    movies: Joi.array().items(Joi.string())
    });
    return Joi.validate(genreName, schema);
}

module.exports= router;