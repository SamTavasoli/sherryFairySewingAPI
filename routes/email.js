const nodemailer = require("nodemailer");

const sendgridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        "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"
    }
  })
);

async function sendMessage(to, subject, message) {
  const from = "samsamtava@gmail.com";
  await transporter.sendMail({
    to,
    from,
    subject,
    html: message
  });
}
exports.sendMessage = sendMessage;