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
  const from = "betuwishuknewbyu@gmail.com";
  await transporter.sendMail({
    to,
    from,
    subject,
    html: message
  });
}
exports.sendMessage = sendMessage;
