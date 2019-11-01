const gmailSend = require("gmail-send");
const config = require("config");

module.exports = async (token, user) => {
  console.log(`Sending password reset email to: ${user.email}`);
  let message = `Dear <b>${user.firstname}</b><br>
    <p>
    Kindly find below is the password reset instruction based on your request.<br>
    Please click the following link to reset your password:<br>
    ${config.get("backend")}/api/v1.0/processreset/${token}
    </p>
    <p>
    If the link above does not work, try copying and pasting it into the address bar in your browser.
    This email is to reset your account password. If you did not request password reset , please ignore this email.
    </p>
    <br>
    <p>
    <b>Regards</b><br>
    www.firemisc.com
    </p>`;

  const send = gmailSend({
    user: "aref.mamdouh@gmail.com",
    pass: "Semsema76Salah",
    to: user.email,
    cc: "maref@firemisc.com",
    from: "firemisc", // from: by default equals to user
    replyTo: "maref@firemisc.com", // replyTo: by default undefined
    subject: "Password reset",
    html: message // HTM
  });
  send({});
};
