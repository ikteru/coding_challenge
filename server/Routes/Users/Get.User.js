const { checkSuccess } = require('../../Utils')
const Models = require('../../Models/Models')

function GetUser(req,res){
    checkSuccess(Models.UserModel.findOne({ userId: req.params.id })).then(
      result => {
        if (result.success) {
          let user = result.data;
          user ? res.send(user) : res.status(404).send("User not found");
        } else {
          res.status(500).send("Error while fecthing user from db");
        }
      }
    );
  }

  module.exports = GetUser 