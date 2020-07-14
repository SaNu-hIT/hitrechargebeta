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

/**
 * @method - POST
 * @param - /signup
 * @description - create shops
 */
router.post(
  "/createshops",
  [],
  async (req, res) => {

    const {
      username,
      phone,
      password,
      distributorId,
      pincode,
      commision,
      _id
    } = req.body;
    try {

      if (_id == "") {
        let user = await Shops.findOne({
          phone
        });
        if (user) {
          return res.status(202).json({
            message: "Shop Already Exists",
            status: "failed",
            statusCode: "202"
          });
        }

        user = new Shops({
          username,
          phone,
          password,
          distributorId,
          pincode,
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
              message: "Shop created successfully"
            });
          }
        );



      } else {
        let user = await Shops.findOne({
          _id
        });
        if (user) {

          //   username,
          //   phone,
          //   password,
          //   distributorId,
          //   pincode,
          //   commision
          user.username = username
          user.phone = phone
          user.commision = commision
          user.pincode = pincode
          // await user.update({
          //   _id
          // });
          await Shops.updateOne({
            _id: user._id
          }, {
            $set: user
          });

          res.status(200).json({
            status: "success",
            statusCode: "200",
            message: "Shop updated successfully"
          });
        }
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);
router.get(
  "/getshops",
  [

  ],
  async (req, res) => {

    try {
      let shops = await Shops.find({});
      res.status(200).json({
        status: "success",
        data: shops
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);


router.post(
  "/getshop",
  [],
  async (req, res) => {
    const {
      shopId
    } = req.body;
    var _id = shopId
    try {
      let shops = await Shops.findOne({
        _id
      });
      res.status(200).json({
        status: "success",
        statusCode: "200",
        message: "Shops get success",
        data: shops
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);


router.post(
  "/getshopBydistributor",
  [],
  async (req, res) => {
    const {
      distributorId
    } = req.body;

    try {
      let shops = await Shops.find({
        distributorId
      });
      res.status(200).json({
        status: "success",
        statusCode: "200",
        data: shops
      });

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);

router.post(
  "/deleteShopbyId",
  [],
  async (req, res) => {
    const {
      shopId
    } = req.body;

    try {

      var _id = shopId
      let shops = await Shops.findOne({
        _id
      });


      if (shops) {
        shops.remove()
        res.status(200).json({
          status: "success",
          statusCode: "200",
          message: "Shop deleted success"
        });
      } else {


        res.status(200).json({
          status: "success",
          statusCode: "200",
          message: "Shop deleted failed"
        });
      }

    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error getting data ");
    }
  }
);

router.post(
  "/shoplogin",
  [
    check("username", "Please Enter a Valid Username")
    .not()
    .isEmpty(),
    check("password", "Please enter a valid password").isLength({
      min: 6
    }), check("device_token", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(1002).json({
        errors: errors.array()
      });
    }
    const {
      username,
      password,
      device_token
    } = req.body;
    try {

      var phone = username
      let user = await Shops.findOne({
        phone
      });

      if (!user) {
        return res.status(200).json({
          Data: {},
          Message: "User not found !",
          Status: "1001",
          Token: "tokkens"
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(200).json({
          Data: {},
          Message: "Incorrect Password !",
          Status: "1002",
          Token: "tokkens"

        });
      const payload = {
        user: {
          id: user.id
        }
      };

      // user.device_token = device_token

      // await user.update();

      jwt.sign(
        payload,
        "randomString", {
          expiresIn: 10000
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            Data: {
              user_id: user.id,
              phone: user.phone
            },
            Message: "Login success !",
            Status: "1000",
            Token: "tokkens"
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);


module.exports = router;