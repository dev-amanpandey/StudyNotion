import React from 'react'
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import HighlightText from '../components/core/Homepage/HighlightText'
//import HighlightText from '../components/core/Homepage/HighlightText';
import CTAButton from '../components/core/Homepage/Button';
import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/Homepage/CodeBlocks';
import TimeLineSection from '../components/core/Homepage/TimeLineSection';
import LearningLanguageSection from '../components/core/Homepage/LearningLanguageSection';
import InstructorSection from '../components/core/Homepage/InstructorSection';
import ExploreMore from '../components/core/Homepage/ExploreMore';
import Footer from '../components/common/Footer';
import ReviewSlider from '../components/common/ReviewSlider';


const Home = ()=>{
return(
    <div >
        {/*section 1*/}
        <div className = 'relative m-auto flex flex-col w-11/12 items-center text-white justify-between'>
            <Link to={"/signup"}>
            <div className = 'group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-blod text-richblack-200 transition-all duration-200 hover:scale-95 w-fit'>
                <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px] text-xl transition-all duration-200 group-hover:bg-richblack-900'>
                    <p>Become an Instructor</p>
                    <FaArrowRight />
                </div>
            </div>
            </Link>
            <div className = 'text-xl font-semibold mt-7 text-center'>
                Empower Your Future with
                <HighlightText text = {"Coding Skills"}/>
            </div>
            <div className= 'mt-4 w-[90%] text-center text-xl font-bold text-richblack-300'>
                With Our Online Coding Courses. Join Now And Unlock Your Potential To Become A Skilled Developer In The World of Technology.
            </div>
            <div className = 'flex flex-row gap-7 mt-8 text-xl'>
                <CTAButton active = {true} linkto={"/signup"}>
                    Learn More
                </CTAButton>
                <CTAButton active = {false} linkto={"/login"}>
                    Book a Demo
                </CTAButton>

            </div>
            <div className = 'mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
                <video 
            className="shadow-[20px_20px_rgba(255,255,255)]"
                muted 
                loop 
                autoPlay
                >
                    <source src = {Banner} type="video/mp4"/>

                </video>
            </div>
            {/*code section 1*/}
            <div>
                <CodeBlocks
                position = {"lg:flex-row"}
                heading = {
                    <h2 className='font-sans text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-richblack-5 sm:text-4xl lg:text-5xl'>
                        Unlock Your <HighlightText text = {'Coding Potential '}/> 
                        With Our Online Courses
                    </h2>
                }
                subheading = {"Join our coding courses and gain the skills you need to succeed in the tech industry. Our expert instructors will guide you through hands-on projects and real-world applications, helping you build a strong foundation in programming languages, web development, data science, and more. Don't miss out on this opportunity to boost your career prospects and become a proficient coder. Enroll now and start your coding journey with us!"}
                ctabtn1 = {
                    {
                        btnText:"Try It Yourself",
                        linkto:"/singup",
                        active:true

                    }
                }
                ctabtn2 = {
                    {
                        btnText:"Book a Demo",
                        linkto:"/login",
                        active:false

                    }
                }
                codeblock = {`<<!DOCTYPE html>\n<html>\n head>\n  <title>My First Web Page</title>\n </head>\n <body>\n  <h1>Hello, World!</h1>\n  <p>This is my first web page.</p>\n </body>\n</html>`}
                codeColor = {"text-yellow-25"}

                />

            </div>
            {/*code section 2*/}
            <div>
                <CodeBlocks
                position = {"lg:flex-row-reverse"}
                heading = {
                    <h2 className='font-sans text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-richblack-5 sm:text-4xl lg:text-5xl'>
                        Unlock Your <HighlightText text = {'Coding Potential '}/> 
                        With Our Online Courses
                    </h2>
                }
                subheading = {"Join our coding courses and gain the skills you need to succeed in the tech industry. Our expert instructors will guide you through hands-on projects and real-world applications, helping you build a strong foundation in programming languages, web development, data science, and more. Don't miss out on this opportunity to boost your career prospects and become a proficient coder. Enroll now and start your coding journey with us!"}
                ctabtn1 = {
                    {
                        btnText:"Try It Yourself",
                        linkto:"/singup",
                        active:true

                    }
                }
                ctabtn2 = {
                    {
                        btnText:"Book a Demo",
                        linkto:"/login",
                        active:false

                    }
                }
                codeblock = {`<<!DOCTYPE html>\n<html>\n head>\n  <title>My First Web Page</title>\n </head>\n <body>\n  <h1>Hello, World!</h1>\n  <p>This is my first web page.</p>\n </body>\n</html>`}
                codeColor = {"text-yellow-25"}

                />

            </div>
            <ExploreMore/>
        </div>






        {/*section 2*/}
        <div className = 'bg-pure-greys-5 text-richblack-700'>
            <div className = 'homepage_bg h-[310px]'>
                <div className='w-11/12 max-w-maxContent flex flec-col items-center justify-between gap-5 mx-auto'>
                <div className='h-[150px]'></div>
                <div className='flex flex-row gap-7 text-white'>
                    <CTAButton active = {true} linkto={"/signup"}>
                    <div className='flex items-center gap-3'>
                        Explore Full Catalog
                        <FaArrowRight />
                        </div>

                </CTAButton>
                <CTAButton active = {false} linkto={"/signup"}>
                    
                        Learn more
                        
                    
                </CTAButton>


                </div>

            </div>

        </div>

                <div className='w-11/12 max-w-maxContent flex flec-col items-center justify-between gap-7'>
        

        <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
            <div className = 'text-4xl font-semibold'>
                Get the skills you need for a
                <HighlightText text = {"job that is in demand"}/>

            </div>
            <div className='flex flex-col gap-10 w-[40%] items-start'>
            <div className='text-[16px]'>
                The modern job market is competitive, and having the right skills can make all the difference. Our courses are designed to equip you with the knowledge and expertise needed to excel in high-demand fields. Whether you're looking to break into tech, data science, or any other industry
            </div>
            <CTAButton active = {true} linkto = {"/signup"}>
            <div>
                Learn More
            </div>
            </CTAButton>

        </div>

        </div>
        


</div>
<TimeLineSection/>
 <LearningLanguageSection/> 
 

</div>




        {/*section 3*/}
<div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter bg-richblack-900 text-white'>

<InstructorSection/>
<h2 className='text-center text-4xl font-semibold mt-10'>Review From Other Learners</h2>
{ReviewSlider()}

</div>





        {/*footer*/}
        <Footer/>
    </div>
)
}
 export default Home
