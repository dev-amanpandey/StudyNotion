import React from 'react'
import HighlightText from '../Homepage/HighlightText';
const Quote = ()=>{
    return(
        <div className='rounded-2xl border border-richblack-700 bg-richblack-800 px-6 py-8 text-center shadow-lg md:px-12 md:py-10'>
            <span className='mb-4 block text-4xl leading-none text-yellow-50' aria-hidden='true'>&ldquo;</span>
            <p className='text-xl font-medium leading-8 text-richblack-25 md:text-2xl'>
                We are passionate about revolutionising the way we learn. Our innovative platform <HighlightText text = {"combines technology"} /> with expertise and community to create unparalleled educational experiences.
            </p>
            <p className='mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-richblack-300'>The StudyNotion team</p>
        </div>
        
    )
}
export default Quote
