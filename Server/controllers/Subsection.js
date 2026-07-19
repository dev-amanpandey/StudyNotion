const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');
//create SubSection 
exports.createSubSection = async(req,res)=>{
    try{
        //data fetch
        const {sectionId, title,timeDuration,description} = req.body;
        //extract file/
        const video = req.files?.videoFile;
        //validation
        if(!sectionId||!title||!timeDuration||!description||!video){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //upload video to cloudinary
        const UploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create subsection
        const SubSectionDetails = await SubSection.create({
            title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:UploadDetails.secure_url,
        })
        //update section with subsection object id
        const updatedSectionDetails = await Section.findByIdAndUpdate(sectionId,
            {$push:{subSections:SubSectionDetails._id}}
            ,{new:true}).populate("subSections");;
        //hw:populate the subsection details in the updatedSectionDetails
        //return response
        return res.status(200).json({
            success:true,
            message:"SubSection created and added to section successfully",
            updatedSectionDetails,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while creating SubSection",
            error:error.message,
        })
    }
};

exports.updateSubSection = async(req,res)=>{
    try{
        const {subSectionId, sectionId, title, timeDuration, description} = req.body;
        const video = req.files?.videoFile;

        if(!subSectionId || !sectionId || !title || !timeDuration || !description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        const updateData = {
            title,
            timeDuration,
            description,
        };

        if(video){
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            updateData.videoUrl = uploadDetails.secure_url;
        }

        await SubSection.findByIdAndUpdate(subSectionId, updateData, {new:true});

        const updatedSectionDetails = await Section.findById(sectionId)
            .populate("subSections")
            .exec();

        return res.status(200).json({
            success:true,
            message:"SubSection updated successfully",
            updatedSectionDetails,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while updating SubSection",
            error:error.message,
        })
    }
}

exports.deleteSubSection = async(req,res)=>{
    try{
        const {subSectionId, sectionId} = req.body;

        if(!subSectionId || !sectionId){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }

        await SubSection.findByIdAndDelete(subSectionId);

        const updatedSectionDetails = await Section.findByIdAndUpdate(
            sectionId,
            {$pull:{subSections:subSectionId}},
            {new:true}
        )
        .populate("subSections")
        .exec();

        return res.status(200).json({
            success:true,
            message:"SubSection deleted successfully",
            updatedSectionDetails,
        });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while deleting SubSection",
            error:error.message,
        })
    }
}
