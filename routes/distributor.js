// Filename : user.js

const express = require("express");
const {
  check,
  validationResult
} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Distributor = require("../model/distributor");
const Wallet = require("../model/wallet");
const ShopWallet = require("../model/shopwalletall");
const Shops = require("../model/shops");
/**
 * @method - POST
 * @param - /createdistributor
 * @description - create distributor
 */
router.post(
  "/createdistributor",
  [

  ],
  async (req, res) => {

    const {
      username,
      phone,
      password,
      distributorId,
      commision
    } = req.body;
    try {

      if (distributorId == "") {
        let user = await Distributor.findOne({
          phone
        });
        if (user) {
          return res.status(400).json({
            msg: "distributor Already Exists"
          });
        }

        user = new Distributor({
          username,
          phone,
          password,
          commision
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(
          payload,
          "randomString", {
            expiresIn: 10000
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({
              status: "success",
              statusCode: "200",
              message: "Disributor create success"
            });

          }
        );
      } else {
        var _id = distributorId
        let user = await Distributor.findOne({
          _id
        });

        user.username = username
        user.phone = phone
        user.commision = commision


        await Distributor.updateOne({
          _id: user._id
        }, {
          $set: user
        });

        res.status(200).json({
          status: "success",
          statusCode: "200",
          message: "Disributor update success"
        });


      }

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in updating");
    }
  }
);


router.post(
  "/getdistributors",
  [],
  async (req, res) => {


    try {
      let distributor = await Distributor.find({});

      res.status(200).json({
        status: "success",
        statusCode: "200",
        message: "Shops update success",
        data: distributor
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);


router.get(
  "/getdistributor",
  [],
  async (req, res) => {


    const {
      distributorId
    } = req.body;

    try {
      let distributor = await Distributor.findOne({
        distributorId
      });
      res.status(200).json({
        status: "success",
        data: distributor
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);


router.post(
  "/distributorlogin",
  [

  ],
  async (req, res) => {


    const {
      phone,
      password
    } = req.body;


    try {
      let user = await Distributor.findOne({
        phone
      });
      if (!user) {
        return res.status(202).json({
          status: "Fialed",
          statusCode: "500",
          token: "",
          message: "User not found",
          userId: ""

        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(202).json({
          status: "Fialed",
          statusCode: "500",
          token: "",
          userId: "",
          message: "Incorrect Password !"
        });
      const payload = {
        user: {
          id: user.id
        }
      };

      // user.phoneId = phoneId
      //
      // await user.update();

      jwt.sign(
        payload,
        "randomString", {
          expiresIn: 10000
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            status: "success",
            statusCode: "200",
            token: token,
            message: "Login success",
            userId: user.id
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);


router.post(
  "/deleteDistriutorbyId",
  [],
  async (req, res) => {
    const {
      distributorId
    } = req.body;

    try {
      var _id = distributorId
      let shops = await Distributor.findOne({
        _id
      });
      if (shops) {
        shops.remove()
        res.status(200).json({
          status: "success",
          statusCode: "200",
          message: "distributor deleted success"
        });
      } else {
        res.status(200).json({
          status: "success",
          statusCode: "200",
          message: "distributor deleted failed"
        });
      }

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);



router.post(
  "/getdistributor",
  [],
  async (req, res) => {
    const {
      distributorId
    } = req.body;
    var _id = distributorId
    try {
      let shops = await Distributor.findOne({
        _id
      });
      if (shops) {
        res.status(200).json({
          status: "success",
          statusCode: "200",
          message: "Distributor get success",
          data: shops
        });
      } else {
        res.status(200).json({
          status: "success",
          statusCode: "200",
          message: "No shop found",
          data: null
        });
      }


    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);



router.post(
  "/addWalletAmount",
  [],
  async (req, res) => {

    const {
      shopId,
      amount,
      distributorId
    } = req.body;

    try {
      var _id = shopId

      let shop = await Shops.findOne({
        _id
      });

      if (shop) {

        let wallet = await Wallet.findOne({
          shopId
        });
        if (wallet) {
          var amo = Number(amount)
          var balacneamount = wallet.wallet_balance
          var updateAmount = balacneamount + amo
          wallet.wallet_balance = updateAmount
          wallet.distributorId = distributorId
          wallet.phone = shop.phone
          console.log(wallet._id, typeof wallet._id);
          await Wallet.updateOne({
            _id: wallet._id
          }, {
            $set: wallet
          });
          var wallet_balance = updateAmount

          var phone = shop.phone
          var shopWallet = new ShopWallet({
            shopId,
            amount,
            distributorId,
            phone,
            wallet_balance
          });
          await wallet.save();
          await shopWallet.save();

        } else {
          let wallet_amount = amount
          let wallet_balance = amount
          let phone = shop.phone
          let wallet = new Wallet({
            shopId,
            wallet_amount,
            wallet_balance,
            distributorId,
            phone
          });
          console.log("SAVE");
          await wallet.save();




          var shopWallet = new ShopWallet({
            shopId,
            distributorId,
            amount,
            phone,
            wallet_balance
          });
          await shopWallet.save();

        }







        res.status(200).json({
          Data: {},
          status: "success",
          statusCode: "200",
          message: "Shops get success"

        });





      } else {

        res.status(200).json({
          Data: {},
          status: "failed",
          message: "Shop is not available",
          statusCode: "500"
        });
      }




    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);




router.post(
  "/getdistributorWalletTransaction",
  [],
  async (req, res) => {
    const {
      distributorId
    } = req.body;

    try {
      let shops = await Wallet.find({
        distributorId
      });
      res.status(200).json({
        status: "success",
        statusCode: "200",
        message: "Distributor get success",
        data: shops
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);



router.post(
  "/getAllWalletTranactions",
  [],
  async (req, res) => {
    const {
      distributorId
    } = req.body;

    try {
      let shops = await ShopWallet.find({
        distributorId
      });
      res.status(200).json({
        status: "success",
        statusCode: "200",
        message: "Distributor get success",
        data: shops
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);



module.exports = router;