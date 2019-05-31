const { checkSuccess } = require('../../Utils')
const Models = require('../../Models/Models')

function PutUserDislikedShops(req,res){
  if( req.params.userId && req.params.shopId ){

    checkSuccess(Models.UserModel.findOne({ userId: req.params.userId }))
      .then(result => {
        if (result.success) {
          let doc = result.data;
          if (doc.dislikedShopsIds.indexOf(req.params.shopId) !== -1) {
            res.status(400).send("Shop already disliked ... ");
            return checkSuccess(Promise.reject("Shop already disliked ..."));
          } else {
            doc.dislikedShopsIds.push(req.params.shopId);
            
            //Remove dislikedshop from favoriteshopsIds
            let temp = doc.likedShopsIds.filter( shopId => shopId !== req.params.shopId);
            doc.likedShopsIds = temp;
            
            doc.save();
          }
        }
        return result;
      })
      .then(result => {
        if (result.success) {
          
          res.send({success: true, data:"Successfully saved dislikedshop"})
          
        }else{
          res.status(404).send({success: false, data:"Error saving dislikedshop"})
        }
        return result;
      })
      .catch(err => console.error(err));
  }else{
    res.status(400).send()
  }
  }

  module.exports = PutUserDislikedShops 