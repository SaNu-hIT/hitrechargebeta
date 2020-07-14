// Filename : user.js

const express = require("express");
const {
  check,
  validationResult
} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const request = require('request');
const fetch = require('node-fetch');
const Transaction = require("../model/transactions");
const Wallet = require("../model/wallet");
/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */



router.post(
  "/gettransactionadmin",
  [

  ],
  async (req, res) => {

    const {
      distributorId
    } = req.body;
    try {

      let transactions = await Transaction.find({
        distributorId
      }).sort({
        date: -1
      });

      res.status(200).json({
        Data: {
          transactions
        },
        Message: "Transation get success",
        Status: "1000",
        Token: "tokkens"
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);

router.post(
  "/gettransactions",
  [
    check("shopId", "Please Enter a Valid shop Id")
    .not()
    .isEmpty()

  ],
  async (req, res) => {

    const {
      shopId
    } = req.body;
    try {
      let transactions = await Transaction.find({
        shopId
      }).sort({
        date: -1
      });

      res.status(200).json({
        Data: {
          transactions
        },
        Message: "Recharge success",
        Status: "1000",
        Token: "tokkens"
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);

router.post(
  "/getwallet",
  [
    check("shopId", "Please Enter a Valid shop Id")
    .not()
    .isEmpty()

  ],
  async (req, res) => {

    const {
      shopId
    } = req.body;

    try {
      let wallet = await Wallet.find({
        shopId
      });
      res.status(200).json({
        Data: {
          wallet
        },
        Message: "success",
        Status: "1000",
        Token: "tokkens"
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);


router.post(
  "/getwallet",
  [
    check("shopId", "Please Enter a Valid shop Id")
    .not()
    .isEmpty()

  ],
  async (req, res) => {

    const {
      shopId
    } = req.body;

    try {
      let wallet = await Wallet.find({
        shopId
      });
      res.status(200).json({
        Data: {
          wallet
        },
        Message: "success",
        Status: "1000",
        Token: "tokkens"
      });

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
      amount
    } = req.body;

    try {
      let wallet = await Wallet.findOne({
        shopId
      });
      if (wallet) {

        var amo = Number(amount)
        var balacneamount = wallet.wallet_balance
        var updateAmount = balacneamount + amo
        wallet.wallet_balance = updateAmount


        console.log(wallet._id, typeof wallet._id);

        await Wallet.updateOne({
          _id: wallet._id
        }, {
          $set: wallet
        });


      } else {
        let wallet_amount = amount
        let wallet_balance = amount
        let wallet = new Wallet({
          shopId,
          wallet_amount,
          wallet_balance
        });
        console.log("SAVE");
        await wallet.save();

      }


      res.status(200).json({
        Data: {},
        Message: "success",
        Status: "1000",
        Token: "tokkens"
      });



    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);


module.exports = router;