const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const crypto = require('crypto');
const FormData = require('form-data');
const axios = require('axios');
const dotenv = require("dotenv");
const firebase = require('./firebase')

// These parameters should be used for all requests
const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN; // Example: sbx:uY0CgwELmgUAEyl4hNWxLngb.0WSeQeiYny4WEqmAALEAiK2qTC96fBad - Please don't forget to change when switching to production
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;
 // Example: Hej2ch71kG2kTd1iIUDZFNsO5C1lh5Gq - Please don't forget to change when switching to production
const SUMSUB_BASE_URL = 'https://api.sumsub.com'; 


dotenv.config();
const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.raw({type: "application/json"}));
app.use(cors({origin: true}));
app.use(`/.netlify/functions/api`, router);

let config = {};
config.baseURL= SUMSUB_BASE_URL;

axios.interceptors.request.use(createSignature, function (error) {
  return Promise.reject(error);
})

function createSignature(config) {
  var ts = Math.floor(Date.now() / 1000);
  const signature = crypto.createHmac('sha256',  SUMSUB_SECRET_KEY);
  signature.update(ts + config.method.toUpperCase() + config.url);

  if (config.data instanceof FormData) {
    signature.update(config.data.getBuffer());
  } else if (config.data) {
    signature.update(config.data);
  }

  config.headers['X-App-Access-Ts'] = ts;
  config.headers['X-App-Access-Sig'] = signature.digest('hex');

  return config;
}

function createAccessToken (externalUserId, levelName = 'basic-kyc-level', ttlInSecs = 3000) {

  let method = 'post';
  let url = `/resources/accessTokens?userId=${externalUserId}&ttlInSecs=${ttlInSecs}&levelName=${levelName}`;

  let headers = {
      'Accept': 'application/json',
      'X-App-Token': SUMSUB_APP_TOKEN
  };

  config.method = method;
  config.url = url;
  config.headers = headers;
  config.data = null;

  return config;
}

//start session, generate access token
router.get("/kyc/start", function (req, res) {
  const {userRef} = req.query
  let externalUserId = userRef //!! user wallet address to generate access token
  let levelName = 'basic-kyc-level'; // kyc-level
   axios(createAccessToken(externalUserId, levelName, 3000))
  .then(function (response) {
    res.status(200).send({...response.data, failed: false})
  }).catch((err)=>{
    console.log(err);
    res.status(500).send({error: err, failed: true})
  })
});


//save or get user address in DB
router.get("/kyc/check", function(req, res){
  const {userRef, uid} = req.query
  firebase.saveOrCheckUser(userRef, uid, res)
})





module.exports = app;
module.exports.handler = serverless(app);
