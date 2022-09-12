const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const serverless = require("serverless-http");
const mailchimp = require("@mailchimp/mailchimp_transactional")("ltdB43P-ZJhLwDAmw9kjUQ");

const app = express();
const router = express.Router();

app.use(express.json())
app.use(`/.netlify/functions/api`, router);


const SendNotification = async(message)=>{
  const response = await mailchimp.messages.sendTemplate({
    key: "ltdB43P-ZJhLwDAmw9kjUQ",
    template_name: "test2", //Template Name in your Mandrill application `https://mandrillapp.com/templates`
    template_content: [],
    message,
  })

  return response[0]
}

router.get('/sendData', (req, res)=>{
  const message = {
    from_email: "sm@burtula.com",  // Verified SMTP Domain
    subject: "Test",
    text: "Hello Test",
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
        name: "firstname",
        content: "user",
      },
    ],
  };

  SendNotification(message).then((response)=>{
    return res.send({status: response})
  })
})

module.exports = app;
module.exports.handler = serverless(app);

