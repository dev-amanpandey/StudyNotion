import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../../services/operations/profileAPI"
import InstructorChart from "./InstructorChart"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    if (!token) return

    ;(async () => {
      setLoading(true)
      const [instructorApiData, result] = await Promise.all([
        getInstructorData(token),
        fetchInstructorCourses(token),
      ])
      setInstructorData(Array.isArray(instructorApiData) ? instructorApiData : [])
      setCourses(Array.isArray(result) ? result : [])
      setLoading(false)
    })()
  }, [token])

  const totalAmount = instructorData.reduce(
    (acc, course) => acc + (Number(course.totalAmountGenerated) || 0),
    0
  )
  const totalStudents = instructorData.reduce(
    (acc, course) => acc + (Number(course.totalStudentsEnrolled) || 0),
    0
  )

  const statistics = [
    { label: "Total Courses", value: courses.length },
    { label: "Total Students", value: totalStudents },
    { label: "Total Income", value: `Rs. ${totalAmount.toLocaleString("en-IN")}` },
  ]

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7">
      <header className="rounded-2xl border border-richblack-700 bg-gradient-to-r from-richblack-800 to-richblack-900 p-6 sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-yellow-50">Instructor dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-richblack-5 sm:text-4xl">
          Hi {user?.firstName || "Instructor"} 👋
        </h1>
        <p className="mt-2 font-medium text-richblack-200">Here’s how your courses are performing today.</p>
      </header>

      {loading ? (
        <div className="spinner" />
      ) : courses.length > 0 ? (
        <div className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex min-h-[430px] items-center rounded-2xl border border-richblack-700 bg-richblack-800 p-6">
                <p className="text-xl font-medium text-richblack-50">Not enough data to visualize yet.</p>
              </div>
            )}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {statistics.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-richblack-700 bg-richblack-800 p-5">
                  <p className="text-sm font-medium text-richblack-300">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-richblack-50">{stat.value}</p>
                </div>
              ))}
            </section>
          </div>

          <section className="rounded-2xl border border-richblack-700 bg-richblack-800 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-bold text-richblack-5">Your Courses</p>
                <p className="mt-1 text-sm text-richblack-300">Recently created courses</p>
              </div>
              <Link to="/dashboard/my-courses" className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-bold text-richblack-900 transition hover:bg-yellow-100">
                View All
              </Link>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 3).map((course) => (
                <article key={course._id} className="overflow-hidden rounded-xl border border-richblack-700 bg-richblack-900 transition duration-200 hover:-translate-y-1 hover:border-richblack-600">
                  <img src={course.thumbnail} alt={course.courseName} className="h-48 w-full object-cover" />
                  <div className="p-4">
                    <p className="truncate text-sm font-semibold text-richblack-50">{course.courseName}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs font-medium text-richblack-300">
                      <span>{Array.isArray(course.studentEnrolled) ? course.studentEnrolled.length : 0} students</span>
                      <span>•</span>
                      <span>Rs. {Number(course.price || 0).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-2xl border border-richblack-700 bg-richblack-800 p-6 py-20 text-center">
          <p className="text-2xl font-bold text-richblack-5">You have not created any courses yet</p>
          <Link to="/dashboard/add-course" className="mt-4 inline-block rounded-lg bg-yellow-50 px-4 py-2 text-lg font-semibold text-richblack-900">
            Create a course
          </Link>
        </div>
      )}
    </div>
  )
}
