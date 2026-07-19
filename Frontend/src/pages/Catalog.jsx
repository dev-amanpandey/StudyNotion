import React, { useEffect, useState } from 'react'
import Footer from '../components/common/Footer'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogaPageData } from '../services/operations/pageAndComponentData';
import Course_Card from '../components/core/Catalog/Course_Card';
import CourseSlider from '../components/core/Catalog/CourseSlider';
import { useSelector } from "react-redux"
import Error from "./Error"

const slugifyCategoryName = (value = "") =>
  value.trim().split(" ").join("-").toLowerCase()

const Catalog = () => {

    const { loading } = useSelector((state) => state.profile)
  const { catalogName } = useParams()
  const [active, setActive] = useState(1)
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryId, setCategoryId] = useState("");

    //Fetch all categories
    useEffect(()=> {
        const getCategories = async() => {
        try {
          const res = await apiConnector("GET", categories.CATEGORIES_API);
          const matchedCategory = res?.data?.allCategories?.find(
            (ct) => slugifyCategoryName(ct.name) === slugifyCategoryName(catalogName)
          );

          if (!matchedCategory) {
            setCatalogPageData({ success: false });
            return;
          }

          setCategoryId(matchedCategory._id);
        } catch (error) {
          console.log("Error fetching categories", error);
          setCatalogPageData({ success: false });
        }
        }
        getCategories();
    },[catalogName]);

    useEffect(() => {
        const getCategoryDetails = async() => {
            try{
                const res = await getCatalogaPageData(categoryId);
                console.log("PRinting res: ", res);
                setCatalogPageData(res);
            }
            catch(error) {
                console.log(error)
            }
        }
        if(categoryId) {
            getCategoryDetails();
        }
        
    },[categoryId]);


    if (loading || !catalogPageData) {
        return (
          <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
            <div className="spinner"></div>
          </div>
        )
      }
      if (!loading && !catalogPageData.success) {
        return <Error />
      }
    
      return (
        <>
          {/* Hero Section */}
          <div className="box-content border-b border-richblack-700 bg-richblack-800 px-4">
            <div className="mx-auto flex min-h-[300px] max-w-maxContentTab flex-col justify-center gap-5 py-10 lg:max-w-maxContent ">
              <p className="text-sm font-medium text-richblack-300">
                Home <span className="px-1 text-richblack-500">/</span> Catalog <span className="px-1 text-richblack-500">/</span>
                <span className="text-yellow-25">
                  {catalogPageData?.data?.selectedCategory?.name}
                </span>
              </p>
              <div className="max-w-3xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-yellow-50">Explore a learning path</p>
                <h1 className="text-3xl font-semibold text-richblack-5 sm:text-4xl">
                {catalogPageData?.data?.selectedCategory?.name}
                </h1>
              </div>
              <p className="max-w-[870px] text-base leading-7 text-richblack-200">
                {catalogPageData?.data?.selectedCategory?.description}
              </p>
              <p className="w-fit rounded-full border border-richblack-600 bg-richblack-700 px-3 py-1.5 text-sm text-richblack-100">
                {catalogPageData?.data?.selectedCategory?.courses?.length || 0} courses available
              </p>
            </div>
          </div>
    
          {/* Section 1: Course discovery controls */}
          <section className="mx-auto box-content w-full max-w-maxContentTab px-4 pb-0 pt-14 lg:max-w-maxContent">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.15em] text-yellow-50">Start here</p>
                <h2 className="mt-2 text-2xl font-semibold text-richblack-5 sm:text-3xl">Courses to Get You Started</h2>
                <p className="mt-2 text-richblack-300">Build your skills with courses chosen for this category.</p>
              </div>
              <p className="text-sm text-richblack-300">Swipe to explore</p>
            </div>
            <div className="mt-7 flex w-fit rounded-lg border border-richblack-700 bg-richblack-800 p-1 text-sm font-medium">
              <button
                type="button"
                className={`rounded-md px-4 py-2 transition-colors ${
                  active === 1
                    ? "bg-yellow-50 text-richblack-900"
                    : "text-richblack-200 hover:text-richblack-5"
                }`}
                onClick={() => setActive(1)}
              >
                Most Popular
              </button>
              <button
                type="button"
                className={`rounded-md px-4 py-2 transition-colors ${
                  active === 2
                    ? "bg-yellow-50 text-richblack-900"
                    : "text-richblack-200 hover:text-richblack-5"
                }`}
                onClick={() => setActive(2)}
              >
                New
              </button>
            </div>
          </section>

          {/* Section 2: Course slider */}
          <section className="mx-auto box-content w-full max-w-maxContentTab px-4 pb-16 pt-7 lg:max-w-maxContent">
            <div className="min-h-[340px]">
              <CourseSlider
                Courses={catalogPageData?.data?.selectedCategory?.courses}
              />
            </div>
          </section>
    
          {/* Section 3 */}
          <section className="border-y border-richblack-800 bg-richblack-800/40">
            <div className="mx-auto box-content w-full max-w-maxContentTab px-4 py-14 lg:max-w-maxContent">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-yellow-50">Popular picks</p>
              <h2 className="mt-2 text-2xl font-semibold text-richblack-5 sm:text-3xl">Frequently Bought Courses</h2>
              <p className="mt-2 text-richblack-300">Courses learners often choose alongside this category.</p>
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {catalogPageData?.data?.mostSellingCourses
                  ?.slice(0, 4)
                  .map((course, i) => (
                    <Course_Card course={course} key={course?._id || i} Height={"h-48 sm:h-56"} />
                  ))}
              </div>
            </div>
          </section>
    
          <Footer />
        </>
      )
    }
    
    export default Catalog
