const Models = require('../../Models/Models')


async function GetUserLikedShopsIds(req,res){
  if(req.params.userId){

    await Models.UserModel.findOne({ userId: req.params.userId }).then(
      async user => {
        if( !user ){
          res.status(404).send("Couldn't find user ... ")
        }else{
          res.send(user.likedShopsIds)
        }
      }
    )
  }else{
    res.status(400).send()
  }
  }

  module.exports = GetUserLikedShopsIds 