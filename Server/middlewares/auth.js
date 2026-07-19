const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require("../models/User");

//auth middleware
exports.auth = async(req,res,next)=>{
    try {
                //extract token
                const authHeader = req.headers?.authorization || req.header("Authorization") || req.header("authorization")
                const bearerToken = typeof authHeader === "string"
                    ? authHeader.replace(/^Bearer\s+/i, "").trim()
                    : null
                const token = req.cookies?.token || req.body?.token || bearerToken

                if (!token) {
                        return res.status(401).json({
                                success:false,
                                message:"Token missing"
                        });
                }
        //verify the token
        try {
           const decode =  jwt.verify(token,process.env.JWT_SECRET);
           console.log(decode);
           req.user = decode; 
        }
         catch (error) {
            //verification failed
            return res.status(401).json({
                success:false,
                message:"Token is invalid"
            });
         }
        next();
            
        }
    
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong Error in verifying token"
        });
    }
}

//isStudent
exports.isStudent = async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Students only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in verifying student role",
        });
    }
}
//isInstructor
exports.isInstructor = async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructors only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in verifying instructor role",
        });
    }
}
//isAdmin
exports.isAdmin = async(req,res,next)=>{
    try {
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admins only",
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error in verifying admin role",
        });
    }
}

