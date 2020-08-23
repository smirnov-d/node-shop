const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
module.exports = async function main(html = "<b>Hello world!</b>", to, textMail){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "d.smirnov@belitsoft.com", // generated ethereal user
      pass: process.env.MAIL_KEY, // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'd.smirnov@belitsoft.com', // sender address
    to: to, // list of receivers
    subject: "Hello ✔", // Subject line
    // text: textMail, // plain text body
    html: html, // html body
  });

  console.log("Message sent: %s", info.messageId);

}
