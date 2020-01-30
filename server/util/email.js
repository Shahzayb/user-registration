const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: process.env.COMPANY_EMAIL,
    subject,
    text,
    html
  };
  return sgMail.send(msg);
};

exports.generateResetPasswordTemplate = (to, username, link) => {
  return {
    to,
    from: process.env.COMPANY_EMAIL,
    subject: 'Reset your password',
    text: `Your username is: 
      ${username}

     Visit this link to reset your password: 
     <a href=${link}>${link}</a>

    Note: This link is only valid for 1 hour. And you cannot reuse this link.
    `,
    html: `Your user name is: 
    <br><br>
      ${username}
    <br><br>
     Visit this link to reset your password:
    <br><br>
     <a href=${link}>${link}</a>
    <br><br>
    <strong>Note:</strong> This link is only valid for 1 hour. And you cannot reuse this link.
    `
  };
};
