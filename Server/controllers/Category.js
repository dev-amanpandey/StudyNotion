const Category = require('../models/category');
//create tag handler
exports.createCategory=async(req,res)=>{
    try{
        //fetch data from request body
        const {name,description}=req.body;
        //validation
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"all fields are required",
            })
        }
        //create entry in db
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Category created successfully",
            
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })

}
};
//get All tags function
exports.showAllcategory=async(req,res)=>{
    try{
        const allCategories = await Category.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"all categories fetched successfully",
            allCategories,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
    };
//category pageDetails
exports.categoryPageDetails  = async (req,res) =>{
    try {
        //get cATEGORYID
        const {categoryId} = req.body;
        //get courses for specified ctaegoryId
        const selectedCategory = await Category.findById(categoryId).populate("course").exec();
        console.log("Selected Category:", selectedCategory);
console.log("Selected Category Course:", selectedCategory.course);
        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data Not Found",
            });
        }
        //get courses for different categories
        const differentCategory = await Category.findOne({
            _id:{$ne:categoryId},
        }).populate("course").exec();
        //get top selling courses : HW
        const allCategories = await Category.find({}).populate("course").exec();
        const allCourses = allCategories.flatMap((category) => category.course);
        const mostSellingCourses = allCourses.sort((a,b)=> b.sold - a.sold).slice(0,10);

        const selectedCategoryData = {
            ...selectedCategory.toObject(),
            courses: selectedCategory.course,
        };

        const differentCategoryData = differentCategory
            ? {
                ...differentCategory.toObject(),
                courses: differentCategory.course,
            }
            : null;
        
        //return response
        return res.status(200).json({
            success:true,
            data:{
                selectedCategory: selectedCategoryData,
                differentCategory: differentCategoryData,
                mostSellingCourses,
            },
        });
        
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,

        })

    }
}
