const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadImageToCloudinary, uploadPdfToCloudinary } = require('../utils/imageUploader');

const uploadLectureNotes = async (file) => {
    const isPdfName = file?.name?.toLowerCase().endsWith('.pdf');
    const isPdfMime = ['application/pdf', 'application/x-pdf', 'application/octet-stream'].includes(file?.mimetype);
    if (!isPdfName || !isPdfMime) {
        throw new Error('Lecture notes must be a PDF file');
    }
    const uploaded = await uploadPdfToCloudinary(file, process.env.FOLDER_NAME);
    if (!uploaded?.secure_url) {
        throw new Error('Lecture notes upload did not return a file URL');
    }
    return uploaded.secure_url;
};
//create SubSection 
exports.createSubSection = async(req,res)=>{
    try{
        //data fetch
        const {sectionId, title,timeDuration,description} = req.body;
        //extract file/
        const video = req.files?.videoFile;
        const notes = req.files?.notesFile;
        if (req.body.hasNotesFile === 'true' && !notes) {
            return res.status(400).json({ success:false, message:"The lecture notes PDF did not reach the server" });
        }
        //validation
        if(!sectionId||!title||!timeDuration||!description||!video){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        //upload video to cloudinary
        const UploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        const notesUrl = notes ? await uploadLectureNotes(notes) : null;
        //create subsection
        const SubSectionDetails = await SubSection.create({
            title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:UploadDetails.secure_url,
            ...(notesUrl && { notesUrl }),
        })
        if (notes && !SubSectionDetails.notesUrl) {
            throw new Error('Lecture notes uploaded but were not saved to the lecture');
        }
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
            savedSubSection: SubSectionDetails,
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
        const notes = req.files?.notesFile;
        if (req.body.hasNotesFile === 'true' && !notes) {
            return res.status(400).json({ success:false, message:"The lecture notes PDF did not reach the server" });
        }

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

        if(notes){
            updateData.notesUrl = await uploadLectureNotes(notes);
        }

        await SubSection.findByIdAndUpdate(subSectionId, updateData, {
            new: true,
            runValidators: true,
        });
        const updatedSubSection = await SubSection.findById(subSectionId).exec();
        if (!updatedSubSection || (notes && !updatedSubSection.notesUrl)) {
            throw new Error('Lecture notes were not saved to this lecture');
        }

        const updatedSectionDetails = await Section.findById(sectionId)
            .populate("subSections")
            .exec();

        return res.status(200).json({
            success:true,
            message:"SubSection updated successfully",
            updatedSectionDetails,
            savedSubSection: updatedSubSection,
        });
    }
    catch(error){
        console.error('updateSubSection failed:', error);
        return res.status(500).json({
            success:false,
            message:error.message || "Error while updating SubSection",
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

// Raw Cloudinary assets are delivered as downloads, so stream the stored PDF
// through the API with an inline disposition for the browser's PDF viewer.
exports.getSubSectionNotes = async (req, res) => {
    try {
        const subsection = await SubSection.findById(req.params.subSectionId).select('notesUrl title');
        if (!subsection?.notesUrl) {
            return res.status(404).json({ success: false, message: 'Lecture notes were not found' });
        }

        const notesUrl = new URL(subsection.notesUrl);
        if (notesUrl.protocol !== 'https:' || notesUrl.hostname !== 'res.cloudinary.com') {
            return res.status(400).json({ success: false, message: 'Lecture notes URL is invalid' });
        }

        const pdfResponse = await fetch(notesUrl);
        if (!pdfResponse.ok) {
            return res.status(502).json({ success: false, message: 'Could not load lecture notes' });
        }

        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'inline');
        res.set('Cache-Control', 'private, max-age=300');
        return res.send(Buffer.from(await pdfResponse.arrayBuffer()));
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Could not load lecture notes' });
    }
};
