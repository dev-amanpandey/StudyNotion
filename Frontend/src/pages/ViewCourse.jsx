import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams } from "react-router-dom"

import CourseReviewModal from "../components/core/ViewCourse/CourseReviewModal"
import VideoDetailsSidebar from "../components/core/ViewCourse/VideoDetailsSidebar"
import { getFullDetailsOfCourse } from "../services/operations/courseDetailsAPI"
import {
  setCompletedLectures,
  setCourseSectionData,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../slices/viewCourseSlice"

export default function ViewCourse() {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [reviewModal, setReviewModal] = useState(false)

  useEffect(() => {
    ;(async () => {
      const courseData = await getFullDetailsOfCourse(courseId, token)
      if (!courseData?.courseContent) return

      const courseDetails = {
        ...courseData,
        courseContent: courseData.courseContent.map((section) => ({
          ...section,
          subSection: section.subSections ?? section.subSection ?? [],
        })),
      }

      dispatch(setCourseSectionData(courseDetails.courseContent))
      dispatch(setEntireCourseData(courseDetails))
      dispatch(setCompletedLectures(courseData.completedVideos ?? []))
      let lectures = 0
      courseDetails.courseContent.forEach((section) => {
        lectures += section.subSection.length
      })
      dispatch(setTotalNoOfLectures(lectures))
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)] w-full max-w-full flex-col overflow-x-hidden lg:flex-row">
        <div className="order-2 w-full min-w-0 lg:order-1 lg:w-auto">
          <VideoDetailsSidebar setReviewModal={setReviewModal} />
        </div>
        <div className="order-1 w-full min-w-0 max-w-full overflow-x-hidden lg:order-2 lg:h-[calc(100vh-3.5rem)] lg:flex-1 lg:overflow-y-auto">
          <div className="w-full max-w-full px-4 py-4 box-border lg:px-6 lg:py-0">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
    </>
  )
}
