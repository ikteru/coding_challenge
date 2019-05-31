const { checkSuccess } = require('../../Utils')
const Models = require('../../Models/Models')

function DeleteUserDislikedShop(req,res){
  if( req.params.userId && req.params.shopId){
    checkSuccess(Models.UserModel.findOne({ userId: req.params.userId })).then(
      result => {
        if (result.success) {
          let doc = result.data;
          //Remove the dislikedshopid from the dislikedshopsids list
          let temp = doc.dislikedShopsIds.filter( shopId => shopId !== req.params.shopId);
          doc.dislikedShopsIds = temp;

          doc.save();
          res.send(doc);
        } else {
          res.status(500).send("Error while updating liked/disliked shops data");
        }
      }
    )
  }else{
    res.status(400).send()
  }
  }

  module.exports =  DeleteUserDislikedShop 