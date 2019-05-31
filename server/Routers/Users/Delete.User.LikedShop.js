const { checkSuccess } = require('../../Utils')
const Models = require('../../Models/Models')

function DeleteUserLikedShop(req,res){
  if( req.params.userId && req.params.shopId ){
    checkSuccess(Models.UserModel.findOne({ userId: req.params.userId })).then(
      result => {
        if ( result.success) {
          if( result.data ){

            let doc = result.data;
            //Remove shopid from likedshopsIds
            let temp = doc.likedShopsIds.filter( shopId => shopId !== req.params.shopId);
            doc.likedShopsIds = temp;
            
            doc.save();
            res.send(doc);
          }else{
            res.status(404).send("No user with the userId: ", req.params.userId," found!");
          }
        } else {
          res.status(500).send("Error while updating liked/disliked shops data");
        }
      }
    );
  } else {
    res.status(400).send()
  }
  }

  module.exports = DeleteUserLikedShop 