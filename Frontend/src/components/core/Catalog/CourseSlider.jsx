import React, { useRef, useState } from "react"

import Course_Card from "./Course_Card"

const CourseSlider = ({ Courses }) => {
  const drag = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false })
  const [isDragging, setIsDragging] = useState(false)

  const handlePointerDown = (event) => {
    // Let taps and right-clicks keep their normal behaviour; only primary-pointer
    // interactions start a Netflix-style horizontal drag.
    if (event.button !== 0) return

    drag.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      moved: false,
    }
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsDragging(true)
  }

  const handlePointerMove = (event) => {
    if (!drag.current.active) return

    const distance = event.clientX - drag.current.startX
    if (Math.abs(distance) > 5) drag.current.moved = true
    event.currentTarget.scrollLeft = drag.current.startScrollLeft - distance
  }

  const stopDragging = (event) => {
    if (!drag.current.active) return
    drag.current.active = false
    setIsDragging(false)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const preventClickAfterDrag = (event) => {
    if (!drag.current.moved) return
    event.preventDefault()
    event.stopPropagation()
    drag.current.moved = false
  }

  if (!Courses?.length) {
    return <p className="text-xl text-richblack-5">No Course Found</p>
  }

  return (
    <div
      aria-label="Course carousel"
      className={`flex gap-5 overflow-x-auto pb-6 pt-1 touch-pan-y select-none scrollbar-hide ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onClickCapture={preventClickAfterDrag}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={stopDragging}
    >
      {Courses.map((course, i) => (
        <div
          className="w-[85%] shrink-0 sm:w-[calc((100%-20px)/2.15)] lg:w-[calc((100%-40px)/3.25)]"
          key={course?._id || i}
        >
          <Course_Card course={course} Height="h-48 sm:h-52" />
        </div>
      ))}
    </div>
  )
}

export default CourseSlider
