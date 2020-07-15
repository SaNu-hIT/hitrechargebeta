// Filename : user.js

const express = require("express");
const {
  check,
  validationResult
} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Shops = require("../model/shops");
const request = require('request');
const fetch = require('node-fetch');
const Transaction = require("../model/transactions");
/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */
router.post(
  "/gettoken",
  [
    check("userId", "Please Enter a Valid Username")
    .not()
    .isEmpty()
  ],
  async (req, res) => {
    try {
      var url = 'https://auth.reloadly.com/oauth/token';
      var headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
      //for live
      var client_id = "SmZPqC2WpnaOvGGmtRNcPecngIZmYhMk"
      var client_secret = "3JwYrlcyov-j89SbNjYkGz9p60XbaA-Y1RbT74F61W6CCCi1lylTAxe3jKQl7O6"
      var audience = "https://topups.reloadly.com"



      var raw = JSON.stringify({
          "client_id": "xXzIvm563MQjH9bbXix9NIW4HLsTPKiv",
          "client_secret": "nDEsFmHIhfNxicxA4w9E8RmPOq-fY5PzBRA2r02JKIBv9LR0GSCEf9nb0LysdxBx",
          "grant_type": "client_credentials",
          "audience": "https://topups-sandbox.reloadly.com"
        }

      );
      fetch(url, {
          method: 'POST',
          headers: headers,
          body: raw
        })
        .then((res) => {
          return res.json()
        })
        .then((json) => {
          console.log("JSON" + json);
          // Do something with the returned data.
          res.status(200).json(json);

        });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.get(
  "/getRechargesByShop",
  [
    check("shopId", "Please Enter a Valid shop Id")
    .not()
    .isEmpty()

  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const {
      shopId
    } = req.body;

    try {
      let user = await Transaction.find({
        shopId
      });
      if (!user) {
        return res.status(400).json({
          msg: "User Not Exists"
        });
      }
      res.status(200).json({
        status: "success",
        data: user
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);


module.exports = router;