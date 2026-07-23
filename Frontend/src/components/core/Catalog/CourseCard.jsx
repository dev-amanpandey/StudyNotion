import React, { useEffect, useState } from 'react'
import RatingStars from '../../common/RatingStars'
import GetAvgRating from '../../../utils/avgRating';
import { Link } from 'react-router-dom';

const CourseCard = ({course, Height}) => {


    const [avgReviewCount, setAvgReviewCount] = useState(0);

    useEffect(()=> {
        const count = GetAvgRating(course.ratingAndReviews);
        setAvgReviewCount(count);
    },[course])


    
  return (
    <>
      <Link to={`/courses/${course._id}`} className="group block h-full">
        <article className="h-full overflow-hidden rounded-xl border border-richblack-700 bg-richblack-800 transition duration-200 hover:-translate-y-1 hover:border-richblack-500 hover:shadow-xl hover:shadow-black/20">
          <div className="overflow-hidden">
            <img
              src={course?.thumbnail}
              alt={course?.courseName || "Course thumbnail"}
              className={`${Height} w-full object-cover transition duration-300 group-hover:scale-105`}
            />
          </div>
          <div className="flex flex-col gap-2 p-4">
            <p className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-6 text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-yellow-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} Star_Size={15} />
              <span className="text-xs text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="mt-1 text-lg font-semibold text-richblack-5">₹ {course?.price}</p>
          </div>
        </article>
      </Link>
    </>
  )
}

export default CourseCard
