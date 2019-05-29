const { checkSuccess } = require('../../Utils')
const Models = require('../../Models/Models')

function PutUserLikedShops(req, res){
    checkSuccess(Models.UserModel.findOne({ userId: req.params.id }))
      .then(result => {
        if (!result.success) {
          res.status(404).send("Not found");
        } else if (result.success && result.data.length === 0) {
          res.status(404).send("Not found");
        } else {
          let doc = result.data;
          if (doc.likedShopsIds.indexOf(req.body.shopId) !== -1) {
            res.status(400).send("Shop already liked ... ");
            return checkSuccess(Promise.reject("Shop already liked ..."));
          } else {
            doc.likedShopsIds.push(req.body.shopId);
            //Remove from dislikedshops ( no real need for this because the user can't see disliked shops so he can't like them)
            let temp = doc.dislikedShopsIds.filter( shopId => shopId !== req.body.shopId);
            doc.dislikedShopsIds = temp;
            
            doc.save();
            return checkSuccess(Promise.resolve(doc));
          }
        }
      })
      .then(result => {
        if (result.success) {
          res.send({ success: true, data:"successfully saved likedshop" })
        } else {
          res.status(404).send({success: false, data: "Error saving shop to liked shops"})
        }
      })
      .catch(err => console.error(err));
  }

  module.exports = PutUserLikedShops 