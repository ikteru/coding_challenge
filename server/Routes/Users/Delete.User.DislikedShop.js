const { checkSuccess } = require('../../Utils')
const Models = require('../../Models/Models')

function DeleteUserDislikedShop(req,res){
    checkSuccess(Models.UserModel.findOne({ userId: req.params.id })).then(
      result => {
        if (result.success) {
          let doc = result.data;
          //Remove the dislikedshopid from the dislikedshopsids list
          let temp = doc.dislikedShopsIds.filter( shopId => shopId !== req.body.shopId);
          doc.dislikedShopsIds = temp;

          doc.save();
          res.send(doc);
        } else {
          res.status(500).send("Error while updating liked/disliked shops data");
        }
      }
    );
  }

  module.exports =  DeleteUserDislikedShop 