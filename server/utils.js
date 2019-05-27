const requestPromise = require("request-promise");
const request = require("request");
const Models = require("./models/models");
const uniqid = require("uniqid");

function checkSuccess(Promise) {
  return Promise.then(result => ({ success: true, data: result })).catch(
    error => ({ success: false, data: error })
  );
}

//Gets shops from google maps places api (nearby places andpoint) and synthesizes the data for to be ready to be stored
async function synthesizeShops(result) {
  console.log(
    " ======================================================================================= "
  );
  console.log("SYNTHESIZED SHOPS RESULT :::: ");
  console.log(result.data.results);
  console.log(
    " ======================================================================================= "
  );
  if (result.success) {
    let googlePlaces = result.data.results;
    if (googlePlaces.length === 0) {
      console.log("EMPTYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
      return Promise.reject("No shop found nearby ... ");
    } else {
      console.log("Successfully retrieved data from google places api ... ");

      let shops = googlePlaces.map(place => {
        const temp = {
          shopId: place.place_id,
          location: place.geometry.location,
          name: place.name,
          icon: place.icon,
          types: place.types,
          photoRef: place.photos ? place.photos[0].photo_reference : "",
          photo: {
            contentType: "",
            data: null
          }
        };
        return temp;
      });
      return shops;
    }
  } else {
    return result;
  }
}

//requestPromises photos from google maps places api (photos endpoint) using photo references from the response
//that we get from the nearby places api requestPromise then saves the final shop data to the db
async function getShopsPhotos(result) {
  console.log(
    " ======================================================================================= "
  );
  console.log("GET SHOP PHOTOS RESULT :::: ");
  console.log(result);
  console.log(
    " ======================================================================================= "
  );

  if (result.success) {
    let places = result.data;
    let resultPlaces = [];
    let count = 0;

    return places.map(place => {
      const options = {
        method: "GET",
        url: "https://maps.googleapis.com/maps/api/place/photo",
        qs: {
          maxwidth: 200,
          photoreference: place.photoRef,
          key: process.env.API_KEY
        },
        resolveWithFullResponse: true
      };

      if (place.photoRef !== "") {
        return checkSuccess(requestPromise(options)).then(result => {
          if (!result.success) {
            console.log("Error while fetching photo buffer  ");
          } else {
            place.photo.contentType = result.data.headers["content-type"];
            // let buffer = result.data.body;
            // let base64enc = Buffer.from(buffer, "binary").toString("base64")
            // place.photo.data = base64enc
            place.photo.data = result.data.body;
          }
          return place;
        });
        // count++;
        // console.log("ARRAY LENGTH:::: ", places.length, " COUNT::: ", count)

        // resultPlaces.push(place)
      }

      // if( count === places.length ){
      //     console.log("Successfully got shop photos ... ")
      //     return resultPlaces
      // }
    });

    // return resultPlaces;
  } else {
    return Promise.reject("Error cz of google ...");
  }
}

async function saveToDb(result) {
  if (result.success) {
    let shops = result.data;
    for (shop of shops) {
      await Models.ShopModel(shop).save();
      console.log("Shop saved to db ... ");
      return true;
    }
  } else {
    return Promise.reject("Trouble saving shops to database ... ");
  }
}

async function firstTimeSearching(userId, locationString) {
  let result = await Models.UserModel.findOne({ userId: userId })
    .lean()
    .then(user => {
      if (user) {
        return !user.searchedLocations.includes(locationString);
      } else {
        return false;
      }
    });
  return result;
}

getShopDetails = async function(shopId) {


    const options = {
      method: "GET",
      url: "https://maps.googleapis.com/maps/api/place/details/json",
      qs: {
        placeid: shopId,
        fields: "name,place_id,photos,types,icon,geometry",
        key: "AIzaSyDz5lQV5PQ6ULRgiuEoFahas_uoGWrHIsQ"
      },
      json: true
    };
    return await requestPromise(options).then(result => {
        const shop = result.result;
        const temp = {
          shopId: shop.place_id,
          location: shop.geometry.location,
          name: shop.name,
          icon: shop.icon,
          types: shop.types,
          photoRef: shop.photos ? shop.photos[0].photo_reference : "",
          photo: {
            contentType: "",
            data: null
          }
        };
        console.log("TEMP :::: ", temp.shopId);
        return temp;
    }).catch(
      err => {
        console.log("Error fetching shop details from google api", err)
        return err
      }
    )
    
  };

module.exports = {
  checkSuccess,
  getShopsPhotos,
  synthesizeShops,
  firstTimeSearching,
  saveToDb,
  getShopDetails
};
