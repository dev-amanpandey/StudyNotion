import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

const getDurationInSeconds = (value) => {
  if (typeof value === "number") return value
  if (typeof value !== "string") return 0

  const duration = value.trim().toLowerCase()
  if (/^\d+(?::\d+){1,2}$/.test(duration)) {
    return duration.split(":").reduce((total, part) => total * 60 + Number(part), 0)
  }

  const hours = Number(duration.match(/(\d+(?:\.\d+)?)\s*(?:h|hour)/)?.[1] || 0)
  const minutes = Number(duration.match(/(\d+(?:\.\d+)?)\s*(?:m|min|minute)/)?.[1] || 0)
  const seconds = Number(duration.match(/(\d+(?:\.\d+)?)\s*(?:s|sec|second)/)?.[1] || 0)

  return hours * 3600 + minutes * 60 + seconds || Number(duration) || 0
}

const getCourseDuration = (course) => {
  const totalSeconds = (course?.courseContent || []).reduce(
    (courseTotal, section) =>
      courseTotal + (section?.subSections || section?.subSection || []).reduce(
        (sectionTotal, lecture) => sectionTotal + getDurationInSeconds(lecture?.timeDuration),
        0
      ),
    0
  )

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  return [
    hours && `${hours}h`,
    minutes && `${minutes}m`,
    ((!hours && !minutes) || seconds) && `${seconds}s`,
  ].filter(Boolean).join(" ")
}

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)
  const getEnrolledCourses = async () => {
    try {
      const res = await getUserEnrolledCourses(token);

      setEnrolledCourses(res);
    } catch (error) {
      console.log("Could not fetch enrolled courses.")
    }
  };
  useEffect(() => {
    getEnrolledCourses();
  }, [])

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
          {/* TODO: Modify this Empty State */}
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="hidden rounded-t-lg bg-richblack-500 md:flex">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`grid grid-cols-1 gap-4 border border-richblack-700 p-4 md:flex md:items-center md:gap-0 md:p-0 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex w-full cursor-pointer items-center gap-3 md:w-[45%] md:gap-4 md:px-5 md:py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 shrink-0 rounded-lg object-cover"
                />
                <div className="flex min-w-0 max-w-xs flex-col gap-2">
                  <p className="break-words font-semibold">{course.courseName}</p>
                  <p className="text-xs text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between px-2 py-1 md:block md:w-1/4 md:py-3">
                <span className="text-richblack-300 md:hidden">Duration</span>
                <span>{getCourseDuration(course)}</span>
              </div>
              <div className="flex w-full flex-col gap-2 px-2 py-1 md:w-1/5 md:py-3">
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
