//Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models/models');

require('dotenv').config();

//Initialize the express app
const app = express();

//Hard coded shops for testing
const shops = [];

//Use helmet for better security
app.use(helmet());

//Body-parser parses the incoming requests and turns them into JSON objects.
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

// get all shops
app.get('/shops', (req, res) => {

    Models.ShopModel.find().exec(
        (err, response ) => {
            console.log("RESPONSE :::: ", err)
            res.send(response)
        }
    )
});

app.get('/users', (req, res) => {
    Models.UserModel.find().lean().exec( (err, response) => {
        res.send(response)
    })
});

app.get('/users/:id/likedshops', (req,res)=>{
    Models.UserModel.findOne({ _id: req.params.id }).lean().exec((err, response)=> { 
        res.send(response.likedShops)
    });
});

app.get('/users/:id/dislikedshops', (req,res)=>{
    Models.UserModel.findOne({ _id: req.params.id }).lean().exec((err, response)=> {
        res.send(response.dislikedShops)
    });
});

// start the server
app.listen(8081, () => {
  console.log('listening on port 8081');
});