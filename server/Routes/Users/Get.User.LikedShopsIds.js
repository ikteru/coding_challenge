const Models = require('../../Models/Models')


async function GetUserLikedShopsIds(req,res){
    await Models.UserModel.findOne({ userId: req.params.id }).then(
      async user => {
        if( !user ){
          res.status(404).send("Couldn't find user ... ")
        }else{
          res.send(user.likedShopsIds)
        }
      }
    )
  }

  module.exports = GetUserLikedShopsIds 