import React from 'react'
import HighlightText from '../components/core/Homepage/HighlightText';
import BannerImage1 from "../assets/Images/aboutus1.webp";
import BannerImage2 from "../assets/Images/aboutus2.webp";
import BannerImage3 from "../assets/Images/aboutus3.webp";
import Quote from '../components/core/AboutPage/Quote';
import FoundingStory from "../assets/Images/FoundingStory.png"
import StatsComponent from '../components/core/AboutPage/Stats';
import LearningGrid from '../components/core/AboutPage/LearningGrid';
import ContactFormSection from '../components/core/AboutPage/ContactFormSection';
import Footer from '../components/common/Footer';
import ReviewSlider from '../components/common/ReviewSlider';
const About = ()=>{
    return(
        <div className='bg-richblack-900 pt-16 text-richblack-5'>
            {/*section 1*/}
            <section className='border-b border-richblack-800 bg-gradient-to-b from-richblack-800/70 to-richblack-900 py-16 md:py-24'>
                <div className='mx-auto w-11/12 max-w-maxContent'>
                    <header className='mx-auto max-w-4xl text-center'>
                        <p className='mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-yellow-50'>About StudyNotion</p>
                        <h1 className='mb-6 text-4xl font-semibold leading-tight md:text-5xl'>Driving innovation in online education for a <span className='text-yellow-50'><HighlightText text = {"brighter future"} /></span></h1>
                        <p className='mx-auto max-w-3xl text-base leading-7 text-richblack-300 md:text-lg'>At our platform, we believe education should be accessible, engaging, and career-focused for every learner. We combine technology with innovative teaching methods to create a simple, effective, and future-ready learning experience.</p>

                    </header>
                    <div className='mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-3'>
                        <img src={BannerImage1} alt='Students learning together' className='h-44 w-full rounded-xl object-cover shadow-[0_12px_32px_rgba(0,0,0,0.28)] md:h-64'/>
                        <img src={BannerImage2} alt='Collaborative online learning' className='h-44 w-full rounded-xl object-cover shadow-[0_12px_32px_rgba(0,0,0,0.28)] md:h-64'/>
                        <img src={BannerImage3} alt='Learning with StudyNotion' className='col-span-2 h-44 w-full rounded-xl object-cover shadow-[0_12px_32px_rgba(0,0,0,0.28)] md:col-span-1 md:h-64'/>
                    </div>
                </div>
            </section>
            {/*section 2*/}
            <section className='py-12 md:py-16'>
                <div className='mx-auto w-11/12 max-w-4xl'>
                    <Quote/>
                </div>
            </section>
            {/*section 3*/}
            <section className='py-12 md:py-16'>
                <div className='mx-auto w-11/12 max-w-maxContent'>
                    <div className = 'flex flex-col'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
                            <div>
                                <p className='mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-50'>Our story</p>
                                <h2 className='mb-5 text-3xl font-semibold md:text-4xl'>Learning without limits</h2>
                                <p className='mb-4 leading-7 text-richblack-300'>Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.</p>

                                <p className='leading-7 text-richblack-300'>As experienced educators ourselves, we witnessed firsthand the limitations of traditional education systems. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.</p>
                            </div>
                            <div className='flex justify-center'>
                                <img
                                    src={FoundingStory}
                                    alt="Founding story"
                                    className="w-full max-w-md rounded-2xl border border-richblack-700 shadow-xl"
                                />
                            </div>
                        </div>
{/*vision and mission*/}
                        <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-2'>
                           <div className='rounded-2xl border border-richblack-700 bg-richblack-800 p-7'>
                                <h3 className='mb-3 text-xl font-semibold text-yellow-50'>Our Vision</h3>
                                <p className='leading-7 text-richblack-300'>With this vision in mind, we set out to create an intuitive platform that combines cutting-edge technology with engaging content for a dynamic learning experience.</p>
                           </div>
                           <div className='rounded-2xl border border-richblack-700 bg-richblack-800 p-7'>
                                <h3 className='mb-3 text-xl font-semibold text-yellow-50'>Our Mission</h3>
                                <p className='leading-7 text-richblack-300'>Our mission is to make quality education accessible to everyone, regardless of background or location, while building critical thinking and real-world skills.</p>
                           </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*section 4*/}
            <div className='border-y border-richblack-800 bg-richblack-800/40 py-12'>
                <div className='mx-auto w-11/12 max-w-maxContent'>
                    <StatsComponent/>
                </div>
            </div>

            {/*section 5*/}
            <section className='py-16'>
                <div className='mx-auto flex w-11/12 max-w-maxContent flex-col items-center gap-16'>
                    <LearningGrid/>
                    <ContactFormSection/>
                </div>
            </section>

            <section className='border-t border-richblack-800 py-16'>
                <div className='mx-auto w-11/12 max-w-maxContent'>
                    <h2 className='text-center text-3xl font-semibold md:text-4xl'>
                        Reviews from our learners
                    </h2>
                    <ReviewSlider />
                </div>
            </section>

            <Footer/>
        </div>
    )
}

export default About
