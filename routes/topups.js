// Filename : user.js

const express = require("express");
const {
  check,
  validationResult
} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const RechargeSchema = require("../model/transactions");
const request = require('request');
const fetch = require('node-fetch');
const TokenSchema = require("../model/token");
const refreshToken = require("../config/refreshToken");
const WalletSchema = require("../model/wallet");
const Shops = require("../model/shops");
/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

// for relody
router.post(
  "/topup", [check("operatorId", "Please Enter a Valid operatorId")
    .not()
    .isEmpty()
  ],
  async (req, res) => {
    try {
      var access_ids = "recharge"
      var distributorId
      var access_id = access_ids
      let token = await TokenSchema.findOne({
        access_id
      });

      const {
        operatorId,
        operatorName,
        shopId,
        discount,
        amount,
        customIdentifier,
        recipientPhone,
        recipientCountryCode,
        recipientNumber,
        senderPhone,
        senderCountryCode,
        senderNumber,
        logoUrl
      } = req.body;
      var success = false
      var ObjectID = require('mongodb').ObjectID;
      console.log(shopId);


      let wallet = await WalletSchema.findOne({
        shopId
      });

      var _id = shopId

      let shops = await Shops.findOne({
        _id
      });


      if (shops) {
        distributorId = shops.distributorId
        console.log("distributorId");
        console.log(distributorId);


        if (wallet) {


          console.log(wallet.wallet_balance);

          if (amount < wallet.wallet_balance) {
            if (token) {


              var access_toke = "Bearer " + token.access_token
              var url = 'https://topups-sandbox.reloadly.com/topups';
              var liveurl = 'https://topups.reloadly.com/topups';
              console.log(access_toke);
              var headers = {
                "Authorization": access_toke,
                "Accept": "application/com.reloadly.topups-v1+json",
                "Content-Type": "application/json"
              }
              var body = JSON.stringify({
                'recipientPhone': {
                  'countryCode': 'IN',
                  'number': recipientPhone
                },
                'senderPhone': {
                  'countryCode': 'IN',
                  'number': senderPhone

                },
                'operatorId': operatorId,
                'amount': amount,
                'useLocalAmount': 'false',
                'customIdentifier': customIdentifier
              });

              console.log(body);

              fetch(liveurl, {
                  method: 'POST',
                  headers: headers,
                  body: body
                })
                .then((res) => {
                  return res.json()
                })
                .then((json) => {
                  console.log(json);
                  if (json.errorCode == "INVALID_TOKEN" || json.errorCode == "TOKEN_EXPIRED" || json.errorCode == "CUSTOM_IDENTIFIER_ALREADY_USED" || json.errorCode == "INSUFFICIENT_BALANCE" || json.errorCode == "INVALID_RECIPIENT_PHONE") {
                    refreshToken()
                    res.status(200).json({
                      Data: {
                        json
                      },
                      Message: json.message,
                      Status: "1100",
                      Token: "tokkens"
                    });
                  } else if (json.transactionId) {

                    var transactionId
                    var recharge = new RechargeSchema({
                      operatorId,
                      operatorName,
                      shopId,
                      discount,
                      amount,
                      customIdentifier,
                      recipientPhone,
                      recipientCountryCode,
                      recipientNumber,
                      senderPhone,
                      senderCountryCode,
                      senderNumber,
                      logoUrl,
                      success,
                      transactionId,
                      distributorId
                    });





                    recharge.success = true
                    recharge.discount = json.discount
                    recharge.transactionId = json.transactionId
                    console.log(recharge);
                    recharge.save();




                    if (wallet) {
                      // update wallet
                      console.log("" + wallet.wallet_balance);
                      var updatebalance = wallet.wallet_balance - json.requestedAmount
                      console.log("" + json.requestedAmount);
                      console.log(updatebalance);
                      wallet.wallet_balance = updatebalance
                      console.log(wallet.wallet_balance);
                      console.log(wallet);
                      console.log(wallet._id);
                      // wallet.remove();
                      var myquery = {
                        _id: ObjectID(wallet._id)
                      };
                      var newvalues = {
                        $set: {
                          wallet_balance: updatebalance
                        }
                      };
                      WalletSchema.updateOne(myquery, newvalues, function(err, res) {
                        if (err) throw err;
                        console.log("1 document updated");
                        console.log(res);
                      });
                    }
                    res.status(200).json({
                      Data: {
                        json
                      },
                      Message: "Top up Success",
                      Status: "1000",
                      Token: "tokkens"
                    });
                  } else {

                    res.status(200).json({
                      Data: {
                        json
                      },
                      Message: json.message,
                      Status: "1001",
                      Token: "tokkens"
                    });
                  }





                });


            } else {
              refreshToken()
              res.status(200).json({
                Data: {},
                Message: "Please try again",
                Status: "1100",
                Token: "tokkens"
              });
            }

          } else {

            res.status(200).json({
              Data: {},
              Message: "Please add moneny to wallet",
              Status: "1002",
              Token: "tokkens"
            });

          }

        } else {
          res.status(200).json({
            Data: {},
            Message: "Please add moneny to wallet",
            Status: "1001",
            Token: "tokkens"
          });
        }
      } else {
        res.status(200).json({
          Data: {},
          Message: "Please try again",
          Status: "1001",
          Token: "tokkens"
        });
      }








    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

// for https://www.cyrusrecharge.in/Root/API/RechargeAPI.aspx
router.post(
  "/topups", [check("operatorId", "Please Enter a Valid operatorId")
    .not()
    .isEmpty()
  ],
  async (req, res) => {
    try {
      var access_ids = "recharge"
      var distributorId
      var access_id = access_ids
      let token = await TokenSchema.findOne({
        access_id
      });

      const {
        operatorId,
        operatorName,
        shopId,
        discount,
        amount,
        customIdentifier,
        recipientPhone,
        recipientCountryCode,
        recipientNumber,
        senderPhone,
        senderCountryCode,
        senderNumber,
        logoUrl
      } = req.body;
      var success = false
      var ObjectID = require('mongodb').ObjectID;
      console.log(shopId);


      let wallet = await WalletSchema.findOne({
        shopId
      });

      var _id = shopId

      let shops = await Shops.findOne({
        _id
      });


      if (shops) {
        distributorId = shops.distributorId
        console.log("distributorId");
        console.log(distributorId);


        if (wallet) {


          console.log(wallet.wallet_balance);

          if (amount < wallet.wallet_balance) {
            if (token) {


              // https: //cyrusrecharge.in/api/recharge.aspx?memberid=AP463986&pin=50EAE84295&number=MOBILE/DTH/DATA_CARD_NUMBER&operator=Operator_Code&circle=Cirlce_Code&amount=AMOUNT&usertx=Your_Txn_ID&format=csv/json/xml


              var baseurl = "https://cyrusrecharge.in/api/recharge.aspx?"
              var memberid = "memberid=AP463986"
              var pin = "&pin=50EAE84295"
              var number = "&number=" + recipientNumber
              var operator = "&operator=" + operatorId
              var circle = "&circle=11"
              var url_amount = "&amount=" + amount
              var usertx = "&usertx=" + customIdentifier
              var format = "&format=json"

              var liveurl = baseurl + memberid + pin + number + operator + circle + url_amount + usertx +
                format

              console.log(liveurl);
              fetch(liveurl, {
                  method: 'GET'
                })
                .then((res) => {
                  return res.json()
                })
                .then((json) => {
                  console.log(json);

                  if (json.Status == "FAILURE" || json.errorCode == "FAILED") {
                    refreshToken()
                    res.status(200).json({
                      Data: {
                        json
                      },
                      Message: json.ErrorMessage,
                      Status: "1100",
                      Token: "tokkens"
                    });
                  } else if (json.ApiTransID != 0) {
                    var transactionId
                    var recharge = new RechargeSchema({
                      operatorId,
                      operatorName,
                      shopId,
                      discount,
                      amount,
                      customIdentifier,
                      recipientPhone,
                      recipientCountryCode,
                      recipientNumber,
                      senderPhone,
                      senderCountryCode,
                      senderNumber,
                      logoUrl,
                      success,
                      transactionId,
                      distributorId
                    });
                    recharge.success = true
                    recharge.discount = "0"
                    recharge.transactionId = json.ApiTransID
                    console.log(recharge);
                    recharge.save();
                    if (wallet) {
                      // update wallet
                      console.log("" + wallet.walle t_balance);
                      var updatebalance = wallet.wallet_balance - json.requestedAmount
                      console.log("" + json.requestedAmount);
                      console.log(updatebalance);
                      wallet.wallet_balance = updatebalance
                      console.log(wallet.wallet_balance);
                      console.log(wallet);
                      console.log(wallet._id);
                      // wallet.remove();
                      var myquery = {
                        _id: ObjectID(wallet._id)
                      };
                      var newvalues = {
                        $set: {
                          wallet_balance: updatebalance
                        }
                      };
                      WalletSchema.updateOne(myquery, newvalues, function(err, res) {
                        if (err) throw err;
                        console.log("1 document updated");
                        console.log(res);
                      });
                    }
                    res.status(200).json({
                      Data: {
                        json
                      },
                      Message: "Top up Success",
                      Status: "1000",
                      Token: "tokkens"
                    });
                  } else {
                    res.status(200).json({
                      Data: {
                        json
                      },
                      Message: json.ErrorMessage,
                      Status: "1001",
                      Token: "tokkens"
                    });
                  }





                });


            } else {
              refreshToken()
              res.status(200).json({
                Data: {},
                Message: "Please try again",
                Status: "1100",
                Token: "tokkens"
              });
            }

          } else {

            res.status(200).json({
              Data: {},
              Message: "Please add moneny to wallet",
              Status: "1002",
              Token: "tokkens"
            });

          }

        } else {
          res.status(200).json({
            Data: {},
            Message: "Please add moneny to wallet",
            Status: "1001",
            Token: "tokkens"
          });
        }
      } else {
        res.status(200).json({
          Data: {},
          Message: "Please try again",
          Status: "1001",
          Token: "tokkens"
        });
      }








    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);



module.exports = router;