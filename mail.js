const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports = async function main({html = "<b>Hello world!</b>", to, subject = 'Hello ✔'}){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_SITE_EMAIL, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
    // text: textMail, // plain text body
  });

  console.log("Message sent: %s", info.messageId);

}
