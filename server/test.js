const request = require("request-promise");
const mongoose = require("mongoose");
const Models = require("./models/models");
const fs = require('fs');


require("dotenv").config();

// const options = {
//     method: 'GET',
//     url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
//     qs: {
//         location:  req.location.lat + "," + req.location.lng,
//         radius: '1000',
//         type: req.shopType ,
//         key: 'AIzaSyBqJDXoWfIY0qli8M7k1x1kR1LUQ4kBcZs'
//     },
//     headers: {
//         'Postman-Token': '3d1428ca-7207-4cf6-bf5b-0b24573fb263',
//         'cache-control': 'no-cache'
//     }
// };

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

// request(options)
// .then( response => JSON.parse(response))
// .then(
//     result => {
//         return result.results.map(
//             place => {
//                 const temp = {
//                     "location": place.geometry.location,
//                     "name": place.name,
//                     "icon": place.icon,
//                     "types": place.types,
//                     "photo": place.photos[0] ? place.photos[0].photo_reference : "",
//                 }
//                 const shop = Models.ShopModel(temp);

//                 shop.save();
//                 return temp;
//             }
//         )
//     }
// )

// const user1 = {
//     username: "ikteru",
//     email: "test@ikteru.com",
//     likedShops: [],
//     dislikedShops: []
// }

// const user2 = {
//     username: "hamza",
//     email: "hamza@ikteru.com",
//     likedShops:["5cdaee88823eb362b687ac3c", "5cdaee88823eb362b687ac3d"],
//     dislikedShops:[]
// }
// const user3 = {
//     username:"Max",
//     email:"max@ikteru.com",
//     likedShops: ["5cdaee88823eb362b687ac3e","5cdaee88823eb362b687ac44","5cdaee88823eb362b687ac3f"],
//     dislikedShops:["5cdd8405b7b3433dd3d476ef","5cdd8405b7b3433dd3d476ed"]
// }

// Models.UserModel(user1).save()
// Models.UserModel(user2).save()
// Models.UserModel(user3).save()

// const options = {
//   method: "GET",
//   url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
//   qs: {
//     location: "-33.8670522" + "," + "151.1957362",
//     radius: "1000",
//     type: "clothing_store",
//     key: process.env.API_KEY
//   }
// };

// request(options)
//   .then(response => JSON.parse(response))
//   .then(googleApiResponse => {
//     console.log(googleApiResponse);
//     return googleApiResponse.results.map(place => {
//       const temp = {
//         location: place.geometry.location,
//         name: place.name,
//         icon: place.icon,
//         types: place.types,
//         photo: "",
//         photoRef: place.photos[0] ? place.photos[0].photo_reference : ""
//       };
//       Models.ShopModel(temp).save();

//       return temp;
//     })
//   })

const options = {
  method: "GET",
  url: "https://maps.googleapis.com/maps/api/place/photo",
  qs: {
    maxwidth: 400,
    photoreference: "",
    key: process.env.API_KEY
  },
  encoding: null
};

Models.ShopModel.find(function(err,docs){
    docs.map(
        doc =>{
            options.qs.photoreference = doc.photoRef
            request(options, (err, response, buffer ) =>{
                doc.photo = buffer
                doc.save()
            })
        }
    )
})
