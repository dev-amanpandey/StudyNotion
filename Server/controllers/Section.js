const Section = require("../models/Section");
const Course = require("../models/Course");

const courseContentPopulate = {
    path: "courseContent",
    populate: {
        path: "subSections",
    },
};
exports.createSection = async(req,res)=>{
    try{
        //data fetch
        const {sectionName, courseId}= req.body;
        //data validation
        if(!sectionName||!courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //create section
        const newSection = await Section.create({sectionName});
        //update course with section 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {$push:{courseContent:newSection._id,}},
            {new:true},
        )
        .populate(courseContentPopulate)
        .exec();

        //return 
        return res.status(200).json({
            success:true,
            message:"Section created and added to course successfully",
            updatedCourse: updatedCourseDetails,
        })

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Failed to create section",
            error:error.message,
        })
    }
}
exports.updateSection = async(req,res)=>{
    try{
        //data fetch
        const {sectionName, sectionId, courseId}=req.body;
        //data validation
        if(!sectionName||!sectionId||!courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //update Data 
        await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
        const updatedCourseDetails = await Course.findById(courseId)
        .populate(courseContentPopulate)
        .exec();
        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated successfully",
            updatedCourse: updatedCourseDetails,
        });
    }
    catch(error){
        res.status(500).json(({
            success:false,
            message:"Failed to update section",
            error:error.message,
        }))
    }
};
exports.deleteSection = async(req,res)=>{
    try{
//getId
const {sectionId, courseId} = req.body;
//findbyidanddelete
await Section.findByIdAndDelete(sectionId);
await Course.findByIdAndUpdate(courseId, {$pull:{courseContent:sectionId}}, {new:true});
const updatedCourseDetails = await Course.findById(courseId)
.populate(courseContentPopulate)
.exec();
//return response
return res.status(200).json({
    success:true,
    message:"Section deleted successfully",
    updatedCourse: updatedCourseDetails,
})

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"Failed to delete section",
            error:error.message,
        })
    }
}