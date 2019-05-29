const { checkSuccess } = require('../../utils')
const Models = require('../../Models/Models')

function DeleteUserLikedShop(req,res){
    checkSuccess(Models.UserModel.findOne({ userId: req.params.id })).then(
      result => {
        if (result.success) {
          let doc = result.data;
          //Remove shopid from likedshopsIds
          let temp = doc.likedShopsIds.filter( shopId => shopId !== req.body.shopId);
          doc.likedShopsIds = temp;
          
          doc.save();
          res.send(doc);
        } else {
          res.status(500).send("Error while updating liked/disliked shops data");
        }
      }
    );
  }

  module.exports = DeleteUserLikedShop 