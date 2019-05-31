const { checkSuccess } = require('../../Utils')
const Models = require('../../Models/Models')

function PostUsers (req,res){
  if( req.body ){
    const newUser = {
      userId: req.body.userId,
      name: req.body.name,
      nickname: req.body.nickname,
      likedShops: req.body.likedShops ? req.body.likedShops : [],
      dislikedShops: req.body.dislikedShops ? req.body.dislikedShops : []
    };
  
    checkSuccess(Models.UserModel(newUser).save()).then(result => {
      if (!result.success) {
        res.status(500).send(result);
      } else {
        res.status(200).send({
          success: true,
          message: "User successfully saved"
        });
      }
    });
  }else{
    res.status(400).send()
  }
  }

  module.exports = PostUsers 