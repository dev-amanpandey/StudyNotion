import React from 'react'

const Stats = [{
    count:"5k", label:"Active Students"},
    {count:"500+", label:"Courses Available"},
    {count:"100+", label:"Expert Instructors"},
    {count:"95%", label:"Student Satisfaction Rate"},
];

const StatsComponent = ()=>{
    return(
        <section>
<div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
    {
        Stats.map((data,index)=>{
            return(
                <div key={index} className="rounded-xl border border-richblack-700 bg-richblack-900 px-4 py-6 text-center">
                    <h1 className="text-3xl font-semibold text-yellow-50">
                        {data.count}
                    </h1>
                    <h2 className="mt-2 text-sm text-richblack-300">
                        {data.label}
                    </h2>
                </div>
            )
        })
    }
</div>
        </section>
    )
}
export default StatsComponent;
