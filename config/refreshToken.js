const express = require("express");
const {
  check,
  validationResult
} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const TokenSchema = require("../model/token");
const request = require('request');
const fetch = require('node-fetch');
const refreshToken = async () => {
  try {

    console.log("call refresh TOKEN");
    var access_ids = "recharge"
    var access_id = access_ids
    let token = await TokenSchema.findOne({
      access_id
    });
    if (token) {
      token.remove();
      console.log("REMOVE TOKEN");
    }
    var url = 'https://auth.reloadly.com/oauth/token';
    var headers = {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
    //for live
    var client_id = "SmZPqC2WpnaOvGGmtRNcPecngIZmYhMk"
    var client_secret = "3JwYrlcyov-j89SbNjYkGz9p60XbaA-Y1RbT74F61W6CCCi1lylTAxe3jKQl7O6"
    var audience = "https://topups.reloadly.com"


    //for test
    // var client_id = "xXzIvm563MQjH9bbXix9NIW4HLsTPKiv"
    // var client_secret = "nDEsFmHIhfNxicxA4w9E8RmPOq-fY5PzBRA2r02JKIBv9LR0GSCEf9nb0LysdxBx"
    // var audience = "https://topups-sandbox.reloadly.com"
    //


    var raw = JSON.stringify({
      "client_id": client_id,
      "client_secret": client_secret,
      "grant_type": "client_credentials",
      "audience": audience
    });
    fetch(url, {
        method: 'POST',
        headers: headers,
        body: raw
      })
      .then((res) => {
        return res.json()
      })
      .then((json) => {
        var access_token = json.access_token
        var scope = json.scope
        var expires_in = json.expires_in
        var token_type = json.token_type
        var access_id = "recharge"
        let toke = new TokenSchema({
          access_token,
          access_id,
          scope,
          expires_in,
          token_type
        });
        toke.save();
        console.log("token refreshed");
      });

  } catch (err) {
    console.log(err.message);

  }

};
module.exports = refreshToken;