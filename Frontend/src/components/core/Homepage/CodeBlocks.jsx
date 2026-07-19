import React from 'react'
import CTAButton from './Button'
import HighlightText from './HighlightText'
import{FaArrowRight} from "react-icons/fa"
import { TypeAnimation } from 'react-type-animation'
const CodeBlocks = ({position, heading, subheading,ctabtn1,ctabtn2, codeblock,backgroundGradient, codeColor})=>{
    const lineNumbers = codeblock.split("\n").map((_, index) => index + 1)

    return (
        <div className = {`my-20 flex flex-col justify-between gap-10 ${position}`}>
            {/*section 1*/}
        <div className='flex w-full flex-col gap-8 lg:w-[50%]'>
            {heading}
            <div className = 'text-richblack-300 font-bold'>
                {subheading}
            </div>
            
            <div className = 'flex gap-7 mt-7'>
                <CTAButton active = {ctabtn1.active} linkto = {ctabtn1.linkto}>
                    <div className = 'flex gap-2 items-center'>
                        {ctabtn1.btnText}
                        <FaArrowRight/>
                    </div>
                </CTAButton>
                <CTAButton active = {ctabtn2.active} linkto = {ctabtn2.linkto}>
                    
                        {ctabtn2.btnText}
                        
                    
                </CTAButton>


            </div>

        </div>
        {/*section 2*/}
        <div className = 'flex h-fit w-full overflow-x-auto rounded-lg border border-richblack-800 bg-richblack-900 py-5 text-xs lg:w-[500px]'>
            <div className = 'flex w-12 shrink-0 flex-col border-r border-richblack-700 pr-3 text-right font-mono font-bold leading-5 text-richblack-400'>
                {lineNumbers.map((lineNumber) => (
                    <span key={lineNumber}>{lineNumber}</span>
                ))}
            </div>
            <div className={`min-w-max flex-1 whitespace-pre font-mono font-bold leading-5 ${codeColor} px-4`}>
                <TypeAnimation
                sequence={[codeblock, 2000, ""]}
                repeat = {Infinity}
                cursor = {true}
                //omitDeletionAnimation = {true}
                style = {
                    {
                        whiteSpace: "pre",
                        display: "block",
                        
                    }
                }

                />
            </div>
        </div>
        </div>
    )
}
export default CodeBlocks;
