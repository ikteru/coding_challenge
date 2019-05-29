const { checkSuccess } = require('../../Utils')
const Models = require('../../Models/Models')

function PutUserDislikedShops(req,res){
    checkSuccess(Models.UserModel.findOne({ userId: req.params.id }))
      .then(result => {
        if (result.success) {
          let doc = result.data;
          if (doc.dislikedShopsIds.indexOf(req.body.shopId) !== -1) {
            res.status(400).send("Shop already disliked ... ");
            return checkSuccess(Promise.reject("Shop already disliked ..."));
          } else {
            doc.dislikedShopsIds.push(req.body.shopId);
            
            //Remove dislikedshop from favoriteshopsIds
            let temp = doc.likedShopsIds.filter( shopId => shopId !== req.body.shopId);
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
  }

  module.exports = PutUserDislikedShops 