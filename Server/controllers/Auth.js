const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const Profile = require("../models/Profile");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//send otp
exports.sendOTP = async(req,res)=>{
    
    try {
        //fetch email from request body
    const {email} = req.body;

    //check if user already exists
    const checkUserPresent = await User.findOne({email});


    //if user exists, return response
    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            messsage:'User already exists'
        })
    }


    //generate otp
    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    console.log("OTP generated: ", otp);


    //check unique otp
    let result = await OTP.findOne({otp:otp});
    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        result = await OTP.findOne({otp:otp});

    }
    const otpPayload = {email,otp};


    //store otp in db
    const otpBody = await OTP.create(otpPayload);
    console.log(otpBody);


    //return response
    return res.status(200).json({
        success:true,
        message:"OTP Sent Successfully",
        otp,
    })

    



    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
        
    }

}
//signup
exports.signUp = async(req,res)=>{
    try {
        //fetch data from request body
    const{
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp,
    }=req.body;
    //validate
    if(!firstName||!lastName||!email||!password||!confirmPassword||!otp||!accountType || !contactNumber){
        return res.status(400).json({
            success:false,
            message:"All fields are required",
        });
    }
    //2 passwords match
    if(password!==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Passwords do not match",
        });
    }
    //check if user already exists
    const existingUser = await User.findOne({email});
    if(existingUser){
        return res.status(400).json({
            success:false,
            message:"User already exists",
        });
    }

    //find most recent otp for the email
    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log(recentOtp);
    //validate otp
    if(recentOtp.length==0){
        //otp not found
        return res.status(400).json({
            success:false,
            message:"OTP not found, please request for a new OTP",
        })   
     } else if(otp!==recentOtp[0].otp){
        //invalid otp
        return res.status(400).json({
            success:false,
            message:"Invalid OTP",
        });
     }

     //Hash password
     const hashedPassword = await bcrypt.hash(password,10);
     //entry cereate in db
     const profileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,

     });
     const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionalDetails:profileDetails._id,
        image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName}+${lastName}`
        // image: `https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`
        // image:'https://api.dicebear.com/9.x/initials/svg?seed=${firstName}+${lastName}',
     })
     //return response
     return res.status(200).json({
        success:true,
        message:"User registered successfully",
        user,
     });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
        
    }

}
//login
exports.login =  async(req,res)=>{
    try {
        //get data from request body
        const {email,password}=req.body;

        //validate data
        if(!email||!password){
            return res.status(403).json({
                success:false,
                message:"All fields are required, please try agin",
            });
        }
        //user check in db
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found, please sign up",
            });
        }
        //generate jwt token after password match
        if(await bcrypt.compare(password,user.password)){
            const payload ={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:'2h',
            });
            user.token=token;
            user.password=undefined;
        //create cookie and send response 
        const options = {
            expires: new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true,
        }
            res.cookie("token",token,options).status(200).json({
                success:true,
                message:"Login successful",
                token,
                user,
            });
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Incorrect password, please try again",
            })
        }
            
    }
     catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

//Change Password
exports.changePassword = async(req,res)=>{
   try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id)

    // Get old password, new password, and confirm new password from req.body
        const { oldPassword, newPassword } = req.body
        const normalizedOldPassword = typeof oldPassword === "string" ? oldPassword.trim() : oldPassword
        const normalizedNewPassword = typeof newPassword === "string" ? newPassword.trim() : newPassword

        if (!normalizedOldPassword || !normalizedNewPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
            normalizedOldPassword,
      userDetails.password
    )
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" })
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(normalizedNewPassword, 10)
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    )

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      )
      console.log("Email sent successfully:", emailResponse.response)
    } catch (error) {
            // Email delivery should not block a successful password update.
      console.error("Error occurred while sending email:", error)
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error)
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    })
  }
}