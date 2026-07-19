const RatingAndReview=require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//createRating
exports.createRating = async (req,res)=>{
    try {
        
    //get user id
    const userId = req.user.id;
    //fetch data from req body
    const {rating, review, courseId} = req.body;
    //check if user is enrolled or not
    const courseDetails = await Course.findOne({_id:courseId,
        studentEnrolled: {$elemMatch: {$eq:userId}},
    });
if(!courseDetails){
    return res.status(404).json({
        success:false,
        message:"student is not enrolled in the course",
    });
}
//check if user already revived the course
const alreadyReviewed = await RatingAndReview.findOne({user:userId,
    course:courseId,
});
if(alreadyReviewed){
    return res.status(403).json({
        success:false,
        message:"course is already reviewed by the user",
    });
}
//create rating and revoew
const ratingReview  = await RatingAndReview.create({rating,review,course:courseId,
    user:userId,
});
//update course with this rating/reiew
await Course.findByIdAndUpdate(courseId,{
    $push:{
        ratingAndReviews:ratingReview._id,
    }
},
{new:true});



//return response
return res.status(200).json({
    success:true,
    message:"rarting and review cretaed successfully ",
    ratingReview

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




//getAverge rating
exports.getAverageRating = async (req, res) => {
try {
    //get course id
    const courseId = req.body.courseId;

    //calculate avg rating
    const result = await RatingAndReview.aggregate([
        {
            $match:{
                course:new mongoose.Types.ObjectId(courseId),
            },
        },
        {
            $group:{
                _id:null,
                averageRating:{$avg:"$rating"},
            }
        }
        
    ])
    
    //return rating
    if(result.length>0){
        return res.status(200).json({
            success:true,
            averageRating: result[0].averageRating,
        })
    }
    //if no rating/review exists
    return res.status(200).json({
        success:true,
        message:'average rating is 0, no rating given til now',
        averageRating:0,
    })

} 
catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message,
    })
    
}
};
//getAllRatingAndReview
exports.getAllRating = async(_req,res) =>{
    try {
        const allReview = await RatingAndReview.find({})
        .sort({ rating: -1 })
        .populate({
            path:"user",
            select:"firstName lastName email image",
        }).populate({
            path:"course",
            select:"courseName",
        }).exec();
    return res.status(200).json({
        success:true,
        message:"all review fetched successfully",
        data:allReview,
    });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
        
    }
}

