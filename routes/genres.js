const express= require('express');
const router=express.Router();
const Joi= require('joi');

const movieGenres=[
    {id: 1, name: 'action'}, // dummy data
    {id: 2, name: 'comedy'},
    {id: 3, name: 'thriller'},
];

router.get('/', (req, res)=>{
    return res.send(movieGenres);
});

router.get('/:genre', (req, res)=>{
    const genre= getGenrebyId(req.params.genreId);
    return genre? res.send(genre): res.status(404).send("Genre Not Found");
});

router.post('/',(req, res)=>{
    const {error, value} = validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    if(getGenrebyName(value.name)) return res.status(400).send('Genre already exists');
    else {
    const newGenre={id: movieGenres.length+1, name: value.name}
    movieGenres.push(newGenre);
    return res.status(200).send(newGenre);
    }
});

router.put('/:genre',(req, res)=>{
    const {error, value} = validateGenre(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    const genre= getGenrebyName(req.params.genreId);
    if(!genre) return res.status(400).send('Genre does not exist');

    genre.name= value.name;

    return  res.status(200).send(value);
});


/** Returns the genre if it exists, otherwise returns undefined */
function getGenrebyId(genreId) {
    return movieGenres.find((genre)=>{
    return genre.id===parseInt(genreId);
    });
}

function getGenrebyName(genreName) {
    return movieGenres.find((genre)=>{
    return genre.name===genreName;
    });
}

function validateGenre(genreName){
    const schema= Joi.object().keys({
    name: Joi.string().min(3).required()
    });
    return Joi.validate(genreName, schema);
}

module.exports= router;