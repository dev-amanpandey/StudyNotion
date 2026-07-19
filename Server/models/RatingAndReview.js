const mongoosse = require('mongoose');
const ratingAndReviewSchema = new mongoosse.Schema({
    user:{
        type: mongoosse.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    },
    course: {
        type: mongoosse.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
    },
});
module.exports = mongoosse.model('RatingAndReview', ratingAndReviewSchema);
