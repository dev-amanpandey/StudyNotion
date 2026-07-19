const mailSender = require("../utils/mailSender");

const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default: Date.now(),
        expires:5*60,
    }
});

//a function to send email
async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = await mailSender(email, "Your Verification OTP from studtyNotion", otp);
        console.log("Mail sent successfully:", mailResponse);
    } catch (error) {
        console.error("Error occured while sending mails:", error);
        throw error;
        
    }
}
otpSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
})



module.exports = mongoose.model('OTP', otpSchema);