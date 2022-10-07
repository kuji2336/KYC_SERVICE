const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const mailchimp = require("@mailchimp/mailchimp_transactional")("ltdB43P-ZJhLwDAmw9kjUQ");

const app = express();
const router = express.Router();

app.use(express.json())
app.use(cors())
app.use(`/.netlify/functions/api`, router);


const SendNotification = async(message)=>{
  const response = await mailchimp.messages.sendTemplate({
    key: "ltdB43P-ZJhLwDAmw9kjUQ",
    template_name: "test2", //Template Name in your Mandrill application `https://mandrillapp.com/templates`
    template_content: [],
    message,
  })

  console.log('here', response[0]);

  return response[0]
}

router.post('/sendGmail', (req, res)=>{
  const dexerTokenAddr = "0xbcbdecf8e76a5c32dba69de16985882ace1678c6"
  const data = JSON.parse(req.body)
  const message = {
    from_email: "sm@burtula.com",  // Verified SMTP Domain
    subject: "Test",
    text: `${req.body.text}`,
    to: [
      {
        email: "sm@burtula.com", // Verified SMTP Domain
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
        content: `this should be dynamic`,
      },
      {
        name: "currency",
        content: `USD`,
      },
      {
        name: "dexerWalletAddress",
        content: `${dexerTokenAddr}`,
      },
      {
        name: "chain",
        content: `USDT`,
      },
      {
        name: "ordererTokensNumber",
        content: `this should be dynamic`,
      },
      {
        name: "paymentWalletAddress",
        content: `${data.wallet}`,
      },
    ],
  };

  SendNotification(message).then((response)=>{
    return res.send({status: response})
  })
})

module.exports = app;
module.exports.handler = serverless(app);

