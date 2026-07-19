import { useMemo, useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

const chartColors = ["#FACC15", "#38BDF8", "#A78BFA", "#34D399", "#FB7185", "#FB923C"]

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")
  const safeCourses = useMemo(
    () => (Array.isArray(courses) ? courses : []),
    [courses]
  )

  const chartData = useMemo(() => ({
    labels: safeCourses.map((course) => course.courseName),
    datasets: [{
      data: safeCourses.map((course) => currChart === "students"
        ? course.totalStudentsEnrolled
        : course.totalAmountGenerated),
      backgroundColor: safeCourses.map((_, index) => chartColors[index % chartColors.length]),
      borderColor: "#161D29",
      borderWidth: 4,
      hoverOffset: 10,
    }],
  }), [currChart, safeCourses])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: 8 },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#F1F2FF",
          boxWidth: 10,
          boxHeight: 10,
          padding: 16,
          usePointStyle: true,
        },
      },
    },
  }

  return (
    <section className="flex min-h-[430px] flex-col rounded-2xl border border-richblack-700 bg-richblack-800 p-5 shadow-lg shadow-black/10 sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-lg font-bold text-richblack-5">Course performance</p>
          <p className="mt-1 text-sm text-richblack-300">Compare your courses at a glance</p>
        </div>
        <div className="flex w-fit rounded-lg bg-richblack-700 p-1 text-sm font-semibold">
          <button
            onClick={() => setCurrChart("students")}
            className={`rounded-md px-3 py-2 transition-all duration-200 ${
              currChart === "students"
                ? "bg-yellow-50 text-richblack-900 shadow-sm"
                : "text-richblack-200 hover:text-yellow-50"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setCurrChart("income")}
            className={`rounded-md px-3 py-2 transition-all duration-200 ${
              currChart === "income"
                ? "bg-yellow-50 text-richblack-900 shadow-sm"
                : "text-richblack-200 hover:text-yellow-50"
            }`}
          >
            Income
          </button>
        </div>
      </div>
      <div className="relative mx-auto mt-4 h-[300px] w-full max-w-[520px]">
        <Pie data={chartData} options={options} />
      </div>
    </section>
  )
}
