//Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models/models');
const request = require('request-promise');
const fs = require('fs');

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

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

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://ikteru.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'Mjwf9Ii0u8jexj8HFuKjgv0LbXnSMqYm',
    issuer: `https://ikteru.auth0.com/`,
    algorithms: ['RS256']
});
  

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

app.get('/auth', checkJwt, (req,res)=> {
    res.send("YOU'RE SET")
})

// get all shops
app.get('/shops', (req, res) => {
    Models.ShopModel.find().lean().then(
        result => res.send(result)
    )
    // const options = { 
    //     method: 'GET',
    //     url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
    //     qs: { 
    //         location:  req.query.lat + "," + req.query.lng,
    //         radius: '1000',
    //         type: req.query.shopType ,
    //         key: process.env.API_KEY 
    //     },
    //     json: true
    // };

    // request(options).then( (googlePlaces)=> {
    //             return googlePlaces.results.map(
    //                 place => {
    //                     const temp = {
    //                         "location": place.geometry.location,
    //                         "name": place.name,
    //                         "icon": place.icon,
    //                         "types": place.types,
    //                         "photoRef": place.photos[0] ? place.photos[0].photo_reference : "",
    //                         "photo": {}
    //                     }

    //                     return temp;
    //                 }
    //             )
    //         }
    //     ).then(
    //         (places) => {
    //             for( let place of places ){
    //                 const options = {
    //                     method: "GET",
    //                     url: "https://maps.googleapis.com/maps/api/place/photo",
    //                     qs: {
    //                     maxwidth: 400,
    //                     photoreference: "",
    //                     key: process.env.API_KEY
    //                     },
    //                     encoding: null
    //                 }
    //                 options.qs.photoreference = place.photoRef
    //                 request(options, (err, response, buffer ) =>{
    //                     place.photo.contentType = response.headers["content-type"]
    //                     //place.photo.size = response.headers["content-length"]
    //                     place.photo.data = buffer
    //                     Models.ShopModel(place).save()
    //                 })
    //             }
    //         }
    //     ).then( ()=> {
    //         res.send("Done.")
    //     })
});

app.post('/shops', (req, res)=>{
    const newShop = new Models.ShopModel(req.body);
    newShop.save();
})

app.get('/shops/:id', (req, res) => {

    Models.ShopModel.find({ _id: req.params.id}).lean().exec(
        (err, response ) => {
            console.log("RESPONSE :::: ", req.params.id)
            res.send(response)
        }
    )
});

app.get('/shops/:id/photo', (req, res) => {

    Models.ShopModel.findOne({ _id: req.params.id}).lean().exec(
        (err, response ) => {
            if(err){
                res.status(404).send("Not found")
            }
            const photo = response.photo.data.buffer
            res.setHeader("content-type", response.photo.contentType)
            res.send(photo)
        }
    )
})

app.get('/users', (req, res) => {
    Models.UserModel.find().lean().exec( (err, response) => {
        res.send(response)
    })
});

app.get('/users/:id', (req, res) => {
    Models.UserModel.find({ _id: req.params.id }).then(
        user => res.send(user)
    )
})

app.put('/users/:id/likedShops', (req, res)=>{
    
    Models.UserModel.findById(req.params.id, (err, doc)=>{
        doc.likedShops.push(req.body.shopId);
        doc.save();
        return doc;
    }).then(
        ()=> {
            Models.ShopModel.findOne({ _id: req.body.shopId }).then( shop => res.send(shop))
        }
    )
});

app.put('/users/:id/dislikedShops', (req, res)=>{
    
    Models.UserModel.findById(req.params.id, (err, doc)=>{
        doc.dislikedShops.push(req.body.shopId);
        doc.likedShops.pop(req.body.shopId)
        doc.save();
    }).then(
        ()=>{
            Models.ShopModel.findOne({ _id: req.body.shopId}).then( shop => res.send(shop))
        }
    )
});

app.delete('/users/:id/likedShops', (req,res)=>{
    Models.UserModel.findById(req.params.id, (err, doc)=>{
        doc.likedShops.pop(req.body.shopId);
        doc.save();
        res.send(doc);
    })
});

app.delete('/users/:id/dislikedShops', (req, res)=>{
    
    Models.UserModel.findById(req.params.id, (err, doc)=>{
        doc.dislikedShops.pop(req.body.shopId);
        doc.save();
        res.send(doc);
    })
});

app.get('/users/:id/likedshops', (req,res)=>{

    Models.UserModel.findOne({ _id: req.params.id })
    .then((user)=> {
        Models.ShopModel.find(
            {
                _id: {
                    $in: user.likedShops
                } 
            }
        ).then(
            shops => {
                console.log(shops)
                res.send(shops)
            }
        )
    })
});

app.get('/users/:id/dislikedshops', (req,res)=>{
    Models.UserModel.findOne({ _id: req.params.id })
    .then((user)=> {
        Models.ShopModel.find(
            {
                _id: {
                    $in: user.dislikedShops
                } 
            }
        ).then(
            shops => {
                console.log(shops)
                res.send(shops)
            }
        )
    })
});

// start the server
app.listen(8081, () => {
  console.log('listening on port 8081');
});