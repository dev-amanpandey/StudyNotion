const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const Category = require('../models/category')
//const Tag = require('../models/category');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');  
//create course handler funcion
exports.createCourse = async(req,res)=>{
    try{
        //fetch data
        const {courseName, courseDescription,whatYouWillLearn,price,tag,category} = req.body;
        //get thumbnail
        const thumbnail = req.files.thumbnailImage;
        //validation
        if(!courseName||!courseDescription||!whatYouWillLearn||!price||!tag||!category|| !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Deatils:", instructorDetails);
        //TODO:verify that userid and instructor id is same or different

        if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor not found",
            });
        }
        //check if tag is valid
        //const tagDetails = await Tag.findById(tag);
        const categoryDetails = await Category.findById(category);
        if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:" category not found",
            });
        }
        //upload thumbnail to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        //create an entry in course collection
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:[tag],
             category: [categoryDetails._id],
            thumbnail: thumbnailImage.secure_url,
        })
        await Category.findByIdAndUpdate(categoryDetails._id, {
            $push: { course: newCourse._id },
        });
        const checkCategory = await Category.findById(categoryDetails._id);

console.log("After update => ", checkCategory.course);
        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate({_id:instructorDetails._id},
            {
            $push:{courses:newCourse._id,

            }
        },
        {new:true},
    );
    //update the TAG ka scheme
    //TODO : HW

    //return response
    return res.status(200).json({
        success:true,
        message:"Course created successfully",
        courseDetails:newCourse,
    });


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to create course",
            error:error.message,
        });
    }
    
};
//get all courses handler function
exports.showAllCourses = async(req,res)=>{
    try{
        const allCourses = await Course.find({},{courseName:true,
            price:true,
            thumbnail:true,
            instructor:true,
            ratingAndReviews:true,
            studentEnrolled:true,}).populate("&instructor").exec();

            return res.status(200).json({
                success:true,
                message:"All courses fetched successfully",
                allCourses,
            });
    }
    catch (error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to fetch courses",
            error:error.message,
        })
    }
};
//getCourseDEtails
exports.getCourseDetails = async(req,res)=>{
    try {
        //get id
        const {courseId} = req.body;
        //find course details
        const courseDetails = await Course.findById(courseId).populate({
                path:"instructor",
                populate:{
                    path:"additionalDetails",
                },
            }
        )
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:"courseContent",
            populate:{
                path:"subSections",
            },
        })
        .exec();
        //validation
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not find the course with ${courseId}`,
            });

        }
        //return response
        return res.status(200).json({
            success:true,
            message:"Course Details fetched successfully",
            data:courseDetails,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }

}

// get all courses for the logged-in instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;

        const instructorCourses = await Course.find({ instructor: instructorId })
            .sort({ createdAt: -1 })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSections",
                },
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Instructor courses fetched successfully",
            data: instructorCourses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch instructor courses",
            error: error.message,
        });
    }
};

// get full details for editing a course
exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course id is required",
            });
        }

        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: {
                    path: "additionalDetails",
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSections",
                },
            })
            .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const courseProgress = await CourseProgress.findOne({
            courseID: courseId,
            userId: req.user.id,
        });

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            courseDetails,
            completedVideos: courseProgress?.completedVideos ?? [],
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch course details",
            error: error.message,
        });
    }
};

// edit an existing course for the logged-in instructor
exports.editCourse = async (req, res) => {
    try {
        const instructorId = req.user.id;
        const { courseId, courseName, courseDescription, whatYouWillLearn, price, tag, category, instructions } = req.body;
        const thumbnail = req.files?.thumbnailImage;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course id is required",
            });
        }

        const course = await Course.findOne({ _id: courseId, instructor: instructorId });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        const updateData = {};

        if (courseName !== undefined) updateData.courseName = courseName;
        if (courseDescription !== undefined) updateData.courseDescription = courseDescription;
        if (whatYouWillLearn !== undefined) updateData.whatYouWillLearn = whatYouWillLearn;
        if (price !== undefined) updateData.price = price;
        if (tag !== undefined) {
            updateData.tag = Array.isArray(tag) ? tag : JSON.parse(tag);
        }
        if (category !== undefined) {
            updateData.category = [category];
        }
        if (instructions !== undefined) {
            updateData.instructions = Array.isArray(instructions) ? instructions : JSON.parse(instructions);
        }
        if (thumbnail) {
            const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
            updateData.thumbnail = thumbnailImage.secure_url;
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            updateData,
            { new: true }
        )
        .populate({
            path: "instructor",
            populate: {
                path: "additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
                path: "subSections",
            },
        })
        .exec();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update course",
            error: error.message,
        });
    }
};

// delete a course for the logged-in instructor
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const instructorId = req.user.id;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course id is required",
            });
        }

        const course = await Course.findOne({ _id: courseId, instructor: instructorId });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        await Course.deleteOne({ _id: courseId });
        await User.findByIdAndUpdate(instructorId, {
            $pull: { courses: courseId },
        });

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete course",
            error: error.message,
        });
    }
};
