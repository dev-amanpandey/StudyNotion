// const nodemailer = require('nodemailer');
// const mailSender = async(email,title,body)=>{
//     try{
//         let transporter = nodemailer.createTransport({
//             host: process.env.MAIL_HOST,
//             auth:{
//                 user: process.env.MAIL_USER,
//                 pass: process.env.MAIL_PASS,
//             }
//         })
//         let info = await transporter.sendMail({
//             from:'StudyNotion || Codehelp - By Aman',
//             to:email,
//             subject: title,
//             html:body,
//         })
//         console.log(info);
//         return info;
//     }
//     catch(err){
//         console.log(info);
//         return info;

//         }
// }
// module.exports = mailSender;
const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "StudyNotion || CodeHelp - By Aman",
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error occurred while sending mail:", err);
    throw err;
  }
};

module.exports = mailSender;