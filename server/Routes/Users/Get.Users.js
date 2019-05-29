const { checkSuccess } = require('../../utils')
const Models  = require('../../Models/Models')

function GetUsers(req, res) {
    checkSuccess(Models.UserModel.find()).then(result => {
      let users = result.data;
      result.success
        ? res.send(users)
        : res.status(500).send("Error while fetching users from db");
    });
  }

  module.exports = GetUsers 