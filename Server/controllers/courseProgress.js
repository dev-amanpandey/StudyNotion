const Course = require("../models/Course")
const CourseProgress = require("../models/CourseProgress")

exports.updateCourseProgress = async (req, res) => {
  try {
    const { courseId, subsectionId } = req.body
    const userId = req.user.id

    if (!courseId || !subsectionId) {
      return res.status(400).json({
        success: false,
        message: "Course ID and subsection ID are required",
      })
    }

    const course = await Course.findOne({
      _id: courseId,
      studentEnrolled: userId,
    })

    if (!course) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course",
      })
    }

    const courseProgress = await CourseProgress.findOneAndUpdate(
      { courseID: courseId, userId },
      { $addToSet: { completedVideos: subsectionId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    return res.status(200).json({
      success: true,
      message: "Lecture marked as complete",
      completedVideos: courseProgress.completedVideos,
    })
  } catch (error) {
    console.error("UPDATE_COURSE_PROGRESS_ERROR", error)
    return res.status(500).json({
      success: false,
      message: "Unable to update course progress",
    })
  }
}
