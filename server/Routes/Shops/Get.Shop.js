const { checkSuccess, getShopDetails } = require('../../Utils')

async function GetShop(req,res){
    const result = await checkSuccess(getShopDetails(req.params.shopId))
    if(result.success){
      res.send(result.data)
    }else{
      res.status(404).send("Couldn't find shop")
    }
  }

  module.exports = GetShop 