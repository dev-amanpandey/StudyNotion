const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require('../models/Course');
const CourseProgress = require('../models/CourseProgress');
const { uploadImageToCloudinary } = require("../utils/imageUploader");

const durationToSeconds = (value) => {
    if (typeof value === "number") return value;
    if (typeof value !== "string") return 0;

    const duration = value.trim().toLowerCase();
    if (/^\d+(?::\d+){1,2}$/.test(duration)) {
        return duration.split(":").reduce((total, part) => total * 60 + Number(part), 0);
    }

    const hours = Number(duration.match(/(\d+(?:\.\d+)?)\s*(?:h|hour)/)?.[1] || 0);
    const minutes = Number(duration.match(/(\d+(?:\.\d+)?)\s*(?:m|min|minute)/)?.[1] || 0);
    const seconds = Number(duration.match(/(\d+(?:\.\d+)?)\s*(?:s|sec|second)/)?.[1] || 0);
    return hours * 3600 + minutes * 60 + seconds || Number(duration) || 0;
};

const formatDuration = (totalSeconds) => {
    const safeSeconds = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0;
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const seconds = safeSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
};
exports.updateProfile = async (req, res) => {
    try {
        //fetch data
        const {gender,dateOfBirth="",about="",contactNumber} = req.body;
        //get userid
        const id = req.user.id;
        //validation
        if(!gender||!contactNumber||!id){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //update profile
        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            profileDetails,
        });
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while updating profile",
            error:error.message,
        })
    }
};

//deleteAccount
//explore cronejob
exports.deleteAccount = async(req,res)=>{
    try {
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }
        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //delete user
        await User.findByIdAndDelete({_id:id});
        //HW: Unenroll the user from all courses in which he enrolled
        //return 
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully",
        })
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while deleting account",
            error:error.message,
        })
        
    }
};

exports.getAllUserDetails = async(req,res)=>{
    try {
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }
        //return response
        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            userDetails,
        });
    } 
    catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while fetching user details",
            error:error.message,
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
        if (!req.files || !req.files.displayPicture) {
            return res.status(400).json({
                success: false,
                message: "Display picture is required",
            })
        }

        const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
            process.env.FOLDER_NAME
    )
    console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findById(userId)
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSections",
                    },
                },
            })
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const courses = userDetails.courses || [];
        const courseIds = courses.map((course) => course._id);
        const progressRecords = await CourseProgress.find({
            userId,
            courseID: { $in: courseIds },
        });
        const progressByCourseId = new Map(
            progressRecords.map((progress) => [String(progress.courseID), progress.completedVideos || []])
        );

        const enrolledCourses = courses.map((courseDoc) => {
            const course = courseDoc.toObject();

            const courseContent = (course.courseContent || []).map((section) => ({
                ...section,
                // Frontend currently reads section.subSection, while schema uses subSections.
                subSection: section.subSections || [],
            }));

            const totalDurationInSeconds = courseContent.reduce((courseTotal, section) => {
                const sectionDuration = (section.subSections || []).reduce((sectionTotal, subSection) => {
                    return sectionTotal + durationToSeconds(subSection.timeDuration);
                }, 0);
                return courseTotal + sectionDuration;
            }, 0);

            const totalLectures = courseContent.reduce(
                (total, section) => total + (section.subSections || []).length,
                0
            );
            const completedVideos = progressByCourseId.get(String(course._id)) || [];
            const progressPercentage = totalLectures
                ? Math.round((completedVideos.length / totalLectures) * 100)
                : 0;

            return {
                ...course,
                courseContent,
                totalDuration: formatDuration(totalDurationInSeconds),
                progressPercentage,
            };
        });

        return res.status(200).json({
            success: true,
            data: enrolledCourses,
        });
    } catch (error) {
        console.log("GET_ENROLLED_COURSES_ERROR", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled courses",
            error: error.message,
        });
    }
};
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = Array.isArray(course.studentEnrolled)
        ? course.studentEnrolled.length
        : 0
      const totalAmountGenerated = totalStudentsEnrolled * (Number(course.price) || 0)

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ success: true, courses: courseData });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
