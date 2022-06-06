const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require ('mongoose');

const stuffRoutes = require ('./routes/stuff');
const userRoutes = require ('./routes/user');

const app = express(); 

const path = require('path') ;

const helmet = require('helmet');

//Variables d'environnement, pour protéger la connexion à la BDD
const dotenv = require('dotenv');
const result = dotenv.config();


//Connexion à la base de données
mongoose.connect(
  `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  // .catch(error =>{console.log(error)}); 
  .catch(() => console.log('Connexion à MongoDB échouée !'));



//Eviter les erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });


//Pour acceder au body de la requete:
app.use(express.json());
// app.use(bodyParser.json());

//Protection en configurant les en-tetes HHTP renvoyés par Express
app.use(helmet());

// Pour acceder aux images
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use ('/api/sauces', stuffRoutes);
app.use('/api/auth', userRoutes);



module.exports = app;