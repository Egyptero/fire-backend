const gmailSend = require("gmail-send");
const config = require("config");

module.exports = async (token, user) => {
  console.log(`Sending user verification email to: ${user.email}`);
  let message = `Dear <b>${user.firstname}</b><br>
    <p>
    <b>Welcome to firemisc. The first online help desk</b>
    Thank you for registering on firemisc, we hope you find it rewarding!<br>
    Please click the following link to confirm your email and complete your registration:<br>
    ${config.get("backend")}/api/v1.0/activate/${token}
    </p>
    <p>
    If the link above does not work, try copying and pasting it into the address bar in your browser.
    This email is to confirm your registration. If you have received this email by mistake, please notify us.
    </p>
    <br>
    <p>
    <b>Thanks & Regards,</b><br>
    www.firemisc.com
    </p>`;

  const send = gmailSend({
    user: "aref.mamdouh@gmail.com",
    pass: "Semsema76Salah",
    to: user.email,
    cc: "maref@firemisc.com",
    from: "firemisc", // from: by default equals to user
    replyTo: "maref@firemisc.com", // replyTo: by default undefined
    subject: "Activate your account at firemisc",
    html: message // HTM
  });
  send({});
};
