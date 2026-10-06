const cloudinary = require('cloudinary').v2


exports.uploadImageToCloudinary = async (File,folder,FileSystemDirectoryReader,height,quality)=>{
    const options = {
        folder:folder,
    };
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resource_type = "auto";

    return await cloudinary.uploader.upload(File.tempFilePath,options);
}

exports.uploadPdfToCloudinary = async (file, folder) => {
    // express-fileupload is configured with useTempFiles, so uploaded files are
    // written to disk and `data` is intentionally empty.
    if (!file?.tempFilePath) {
        throw new Error("The PDF file was empty or did not reach the server");
    }

    const safeName = (file.name || "lecture-notes.pdf")
        .replace(/\.pdf$/i, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .slice(0, 80) || "lecture-notes";

    return await cloudinary.uploader.upload(file.tempFilePath, {
            folder,
            public_id: `${safeName}-${Date.now()}.pdf`,
            resource_type: "raw",
    });
};
