const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_transactional")(process.env.MAILCHIMP_KEY);

const app = express();

const message = {
  from_email: "test@burtula.com",  // Verified SMTP Domain
  subject: "Hello world",
  text: "Welcome to Dexer Transactional !",
  to: [
    {
      email: "test@burtula.com", // Verified SMTP Domain
      type: "to",
    },
  ],
  merge: true,
  merge_language: "handlebars",

  // Replaces template vairables in Mandrill Template {{firstname}}
  global_merge_vars: [   
    {
      name: "firstname",
      content: "2001",
    },
  ],
};

async function run() {
  const response = await mailchimp.messages.sendTemplate({
    key: process.env.MAILCHIMP_KEY,
    template_name: "test2", //Template Name in your Mandrill application `https://mandrillapp.com/templates`
    template_content: [],
    message,
    async: true,
  });
  console.log(response);
}

app.get("/gmail", (req, res) => {
  run();
  res.send("connected");
});

app.listen(3000);
