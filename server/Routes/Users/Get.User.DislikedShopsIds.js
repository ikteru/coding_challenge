const Models = require('../../Models/Models')

async function GetUsersDislikedShopsIds(req,res){
    await Models.UserModel.findOne({ userId: req.params.id }).then(
      async user => {
        if( !user ){
          res.status(404).send("Couldn't find user ... ")
        }else{
          res.send(user.dislikedShopsIds)
        }
      }
    )
  }

  module.exports = GetUsersDislikedShopsIds 