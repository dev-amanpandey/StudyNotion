const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require("bcrypt");
const crypto = require("crypto");
//resetPasswordToken
exports.resetPasswordToken = async(req,res)=>{
    try {
       //get email from req body
    const email = req.body.email;
    //check user present with email
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found with this email"
        });
    }
    //generate token
    const token = crypto.randomUUID(); 
    console.log("Generated Token:", token);
    //update user by adding token and token expiry
    const updatedUser = await User.findOneAndUpdate({email:email},
        {token:token,
        resetPasswordExpires:Date.now()+15*60*1000
        },
        {new:true}
    );
    //create url
    const url = `http://localhost:3000/update-password/${token}`;
    //send mail containing the url 
    await mailSender(email,
    "Password Reset Link",
    `Click on the link to reset your password. This link is valid for 15 minutes only. ${url}`);
    //return response
    return res.json({
        success:true,
        message:"Email sent successfully, please check email and change pwd",
    });
     
    }
     catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in sending reset password email",
        })
        
    }
}

//resetPassword
exports.resetPassword = async(req,res)=>{
    try {
        //data fetch 
    const {password,confirmPassword,token} = req.body;
    console.log("Received Token:", token);
    //validation
    if(!password || !confirmPassword || !token){
        return res.status(400).json({
            success:false,
            message:"All fields are required, please try again",
        });
    }
    if(password !== confirmPassword){
    return res.status(400).json({
        success:false,
        message:"Passwords do not match",
    });
}
    //get userdetails from db using token 
    const userDetails = await User.findOne({
        token:token,
        resetPasswordExpires: { $gt: Date.now() },
    });
    //if no entry found , token invalid
    if(!userDetails){
        return res.status(401).json({
            success:false,
            message:"Token is invalid, please try again",
            
        });
    }
    //token time check
    if(userDetails.resetPasswordExpires<Date.now()){
        return res.status(401).json({
            success:false,
            message:"Token has expired, please try again",
        });
    }
    //hash pwd 
    const hashedPassword = await bcrypt.hash(password,10);

    //password update in db
    await User.findOneAndUpdate({token:token},
        {password:hashedPassword,
            token: undefined,
            resetPasswordExpires: undefined,
        },
        {new:true},
    );
    //return response
    return res.status(200).json({
        success:true,
        message:"Password updated successfully, please login now",
    });
        
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error in resetting password, please try again",
        })
    }
}
