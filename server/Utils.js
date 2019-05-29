const requestPromise = require("request-promise");
const Models = require("./Models/Models");

//A promise wrapper for the asynchronous requests I will be making in the server
function checkSuccess(Promise) {
  return Promise.then(result => ({ success: true, data: result })).catch(
    error => ({ success: false, data: error })
  );
}

//Gets shops from google maps places api (nearby places andpoint) and synthesizes the data for to be ready to be stored
async function synthesizeShops(result) {

  if (result.success) {
    let googlePlaces = result.data.results;
    if (googlePlaces.length === 0) {
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

//To be used to check if the client already searched for nearby places in the same coordinates
//Will be helpful in caching and to avoid calling the Google API too many useless times

firstTimeSearching = async function(userId, locationString) {
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
    url: process.env.API_PLACES_DETAILS_BASE_ADDRESS,
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
  synthesizeShops,
  getShopDetails
};
