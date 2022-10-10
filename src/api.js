const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const helpers = require('./helpers')
const axios = require("axios");
const axiosRetry = require('axios-retry')
const { v4: uuidv4 } = require("uuid");
const mailchimp = require("@mailchimp/mailchimp_transactional")(
  "ltdB43P-ZJhLwDAmw9kjUQ"
);


const app = express();
const router = express.Router();

app.use(express.json());
app.use(cors());
app.use(`/.netlify/functions/api`, router);

const SendNotification = async (message) => {
  const response = await mailchimp.messages.sendTemplate({
    key: "ltdB43P-ZJhLwDAmw9kjUQ",
    template_name: "test2", //Template Name in your Mandrill application `https://mandrillapp.com/templates`
    template_content: [],
    message,
  });

  return response[0];
};

const COIN_MARKET_CAP_BASE_URI = "https://pro-api.coinmarketcap.com/v1";

const getTokenPriceInUSD = async (token) => {
  const response = await axios.get(
    `${COIN_MARKET_CAP_BASE_URI}/cryptocurrency/quotes/latest?symbol=${token}&convert=usd`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": "5932a5df-d96c-4421-8d35-866445a11081",
      },
    }
  );

  return response;
};

router.get("/convert", (req, res) => {
  getTokenPriceInUSD(req.query.token)
    .then((response) => {
      const code = response.data.status.error_code;
      const price =
        response.data.data[req.query.token]["quote"]["USD"]["price"];
      res.send({ code, price });
    })
    .catch((err) => {
      res.send({ data: err });
    });
});

router.post("/sendGmail", (req, res) => {
  const dexerTokenAddr = "0xbcbdecf8e76a5c32dba69de16985882ace1678c6";
  const data = JSON.parse(req.body);
  console.log('response--->', data);
  const message = {
    from_email: "kb@burtula.com", // Verified SMTP Domain
    subject: "Test",
    text: `${req.body.text}`,
    to: [
      {
        email: "kb@burtula.com", // Verified SMTP Domain
        type: "to",
      },
    ],

    merge: true,
    merge_language: "handlebars",

    // Replaces template vairables in Mandrill Template {{firstname}}
    global_merge_vars: [
      {
        name: "orderNumber",
        content: `${uuidv4()}`,
      },
      {
        name: "total",
        content: `${data.total}`,
      },
      {
        name: "currency",
        content: data.currency,
      },
      {
        name: "dexerWalletAddress",
        content: `${dexerTokenAddr}`,
      },
      {
        name: "chain",
        content: `${data.chain}`,
      },
      {
        name: "ordererTokensNumber",
        content: `${helpers.calculateTokenAmount(data.usd)}`,
      },
      {
        name: "paymentWalletAddress",
        content: `${data.wallet}`,
      },
      {
        name: "referral",
        content: `${data.referral}`,
      },
      {
        name: "walletAddress",
        content: data.non_bnb
      }
    ],
  };

  SendNotification(message).then((response) => {
    return res.send({ status: response });
  });
});



module.exports = app;
module.exports.handler = serverless(app);

