const gmailSend = require("gmail-send");
const config = require("config");

module.exports = async (password, user) => {
  console.log(`Sending temp password to email to: ${user.email}`);
  let message = `Dear <b>${user.firstname}</b><br>
    <p>
    Your account password at firemisc has been reset and you have been issued with a new temporary password. 
    Your current login information is now: <br>
    username: ${user.email}<br>
    password: ${password} <br>
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
    subject: "Temporary Password",
    html: message // HTM
  });
  send({});
};
