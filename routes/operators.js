const express = require("express");
const {
  check,
  validationResult
} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Shops = require("../model/shops");
const TokenSchema = require("../model/token");
const PlansSchema = require("../model/plans");
const OperatorsSchema = require("../model/operators");
const request = require('request');
const fetch = require('node-fetch');
const refreshToken = require("../config/refreshToken");
/**
 * @method - POST
 * @param - /operators
 * @description - User SignUp
 */
router.post(
  "/operators",
  [
    check("phone", "Please Enter a Valid Username")
    .not()
    .isEmpty()
  ],
  async (req, res) => {
    try {
      const {
        phone
      } = req.body;

      var access_ids = "recharge"
      var access_id = access_ids
      let token = await TokenSchema.findOne({
        access_id
      });
      if (token) {
        var access_toke = token.access_token
        var url = 'https://topups-sandbox.reloadly.com/operators/auto-detect/phone/' + phone + '/countries/IN?&includeBundles=true';
        var headers = {
          "Authorization": "Bearer " + access_toke,
          "Accept": "application/com.reloadly.topups-v1+json"
        }
        console.log(headers);
        fetch(url, {
            method: 'GET',
            headers: headers
          })
          .then((res) => {
            return res.json()
          })
          .then((json) => {
            console.log(json);
            // Do something with the returned data.
            if (json.errorCode == "INVALID_TOKEN" || json.errorCode == "TOKEN_EXPIRED") {
              //refreshToken
              refreshToken()
              res.status(200).json({
                Data: {},
                Message: "Please try again",
                Status: "1100",
                Token: "tokkens"
              });
            } else {
              res.status(200).json({
                Data: {
                  json
                },
                Message: "Operator api success",
                Status: "1000",
                Token: "tokkens"
              });
            }
          });
      } else {
        //refreshToken
        refreshToken()
        res.status(200).json({
          Data: {},
          Message: "Token renewed try again",
          Status: "1000",
          Token: "tokkens"
        });

      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/alloperators",
  [],
  async (req, res) => {
    try {
      const {
        phone
      } = req.body;

      let operators = await OperatorsSchema.find({});

      res.status(200).json({
        Data: {
          operators
        },
        Message: "success",
        Status: "1000",
        Token: "tokkens"
      });


    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/addOperators",
  [],
  async (req, res) => {
    try {

      const {
        name,
        operatorId,
        logoUrls,
        type
      } = req.body;



      var operator = new OperatorsSchema({
        name,
        operatorId,
        logoUrls,
        type
      });
      await operator.save();
      res.status(200).json({
        Data: {
          operator
        },
        Message: "operator added success",
        Status: "1000",
        Token: "tokkens"
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/getPlans",
  [],
  async (req, res) => {
    try {
      const {
        operator
      } = req.body;

      let plans = await PlansSchema.find({});
      // if (operator=="")
      // {
      //    plans = await PlansSchema.find({
      //   });
      // }else
      // {
      // let plans = await PlansSchema.find({
      //   operator
      // });
      // }

      if (plans) {
        res.status(200).json({
          Data: {
            plans
          },
          Message: "success",
          Status: "1000",
          Token: "tokkens"
        });

      } else {
        res.status(200).json({
          Data: {
            plans
          },
          Message: "No plans found",
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


router.post(
  "/addPlans",
  [],
  async (req, res) => {
    try {

      const {
        Price,
        operator,
        Description,
        Validity,
        Talktime,
        Plan_type
      } = req.body;



      var plans = new PlansSchema({
        Price,
        operator,
        Description,
        Validity,
        Talktime,
        Plan_type
      });
      await plans.save();
      res.status(200).json({
        Data: {
          plans
        },
        Message: "Plans added success",
        Status: "1000",
        Token: "tokkens"
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);




router.post(
  "/getAlloperators",
  [],
  async (req, res) => {
    try {
      const {
        phone
      } = req.body;

      var access_ids = "recharge"
      var access_id = access_ids
      let token = await TokenSchema.findOne({
        access_id
      });
      if (token) {

        https: //topups.reloadly.com/operators/countries/HT
          var access_toke = token.access_token
        var url = 'https://topups-sandbox.reloadly.com/operators/countries/IN';
        var headers = {
          "Authorization": "Bearer " + access_toke,
          "Accept": "application/com.reloadly.topups-v1+json"
        }
        console.log(headers);
        fetch(url, {
          method: 'GET',
          headers: headers
        })
        .then((res) => {
          return res.json()
        })
        .then((json) => {
          console.log(json);
          // Do something with the returned data.
          if (json.errorCode == "INVALID_TOKEN" || json.errorCode == "TOKEN_EXPIRED") {
            //refreshToken
            refreshToken()
            res.status(200).json({
              Data: {},
              Message: "Please try again",
              Status: "1100",
              Token: "tokkens"
            });
          } else {
            var i;
            for (i = 0; i < json.length; i++) {
              var item = json[i]
              var operatorId = item.operatorId
              var name = item.name
              var logoUrls = item.logoUrls[item.logoUrls.length - 1]
              var type
              console.log(name.indexOf("DTH"));
              if (name.indexOf("DTH") == -1) {
                type = "MOBILE"
              } else {
                type = "DTH"
              }
              var operator = new OperatorsSchema({
                name,
                operatorId,
                logoUrls,
                type
              });
              operator.save();
            }



            res.status(200).json({
              Data: {
                json
              },
              Message: "Operator api success",
              Status: "1000",
              Token: "tokkens"
            });
          }
        });
      }
      else {
        //refreshToken
        refreshToken()
        res.status(200).json({
          Data: {},
          Message: "Token renewed try again",
          Status: "1000",
          Token: "tokkens"
        });

      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/getAllPlansFromServer",
  [],
  async (req, res) => {
    try {
      const {
        operator_id
      } = req.body;

      var url = 'https://api.datayuge.com/v6/rechargeplans/?apikey=aPuHX8x9HInKQxhDOsnJEx5SDXjyJN33&operator_id=' + operator_id + '&circle_id=kerala';


      fetch(url, {
          method: 'GET'
        })
        .then((res) => {
          return res.json()
        })
        .then((json) => {
          // console.log(json);

          // "id": "1034",
          // "operator_id": "Airtel",
          // "circle_id": "Kerala",
          // "recharge_amount": "3997",
          // "recharge_validity": "30 days",
          // "recharge_short_desc": "Recharge of Rs. 3997 by Airtel",
          // "recharge_long_desc": "International Roaming Incoming: Unlimited -- Intl Local / Calls to India: 500 minutes -- Roaming International SMS: 100 SMS -- International Roaming Data: 5 GB -- Covered Countries : USA, UK, Canada, France, Germany, Netherlands, China, Indonesia, Hong Kong, Bahrain, Turkey, Kuwait & more countries -- Visit www.airtel.in/ir",
          // "recharge_type": "SMS",
          // "updated_at": "07-07-2020 10:43:07"


          // Price:
          // Description
          // Validity:
          // Talktime:
          // Plan_type:
          // operator:
          console.log(json.data.length);
          var i;
          for (i = 0; i < json.data.length; i++) {
            var item = json.data[i]
            console.log(item);
            var Price = item.recharge_amount
            var Description = item.recharge_short_desc
            var Plan_type = item.recharge_type
            var Validity = item.recharge_validity
            var operator = item.operator_id
            var Talktime = item.recharge_long_desc
            var operator = new PlansSchema({
              Price,
              Description,
              Plan_type,
              Validity,
              operator,
              Talktime
            });
            operator.save();
          }



          res.status(200).json({
            Data: {
              json
            },
            Message: "Operator api success",
            Status: "1000",
            Token: "tokkens"
          });

        });


    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);




module.exports = router;