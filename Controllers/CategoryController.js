const categoryModel = require("../models/categoryModel.js");
const slugify = require('slugify');


const createCategoryController = async(req,res) => {
    console.log("Creating");
    
    try {
       const{name} = req.body;

       if(!name){
        return res.status(401).send({
            success : false,
            message : " Name is required",

        })

       }

       const existingCategory = await categoryModel.findOne({name});

       if(existingCategory){
        return res.status(200).send({
            success : true,
            message : "This category already exist"
        })
       }
       const category = await new categoryModel({
        name,
        slug:slugify(name)
       }).save();

       res.status(201).send({success : true , message : 'new category created' , category})
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message : "error in the category Controller",
            error
        })
    }

}

const updateCategoryController = async(req,res) => {
    console.log("Updating");
    try {
       
        
        const {name} = req.body;
        const {id} =  req.params;

        const category = await categoryModel.findByIdAndUpdate(id , {name , slug : slugify(name)} , {new : true});

        res.status(200).send({
            success : true,
            message : " the category is updated",
            category
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success : false,
            message : " problem in updateController",
        })
    }
}

const categoryController = async(req,res) => {
   console.log("getting");
   

  try {
    const category = await categoryModel.find({});
    res.status(200).send({
        success : true,
        message : " All category List",
        category
    })
  } catch (error) {
    console.log(error);
        return res.status(500).send({
            success : false,
            message : " problem in Get All Controller",
        })
    
  }

}

 const singleCategoryController = async(req,res) => {
    console.log("single");
    
    try {
        
        const category = await categoryModel.findOne({slug : req.params.slug});
        res.status(200).send({
            success : true,
            message : "  Single category successfully ",
            category
        })
      } catch (error) {
        console.log(error);
            return res.status(500).send({
                success : false,
                message : " problem in Get single Controller",
            })
        
      }

 }

 const deleteCategoryController = async(req,res) => {
    console.log("deleting");
    
    try {
        const {id} = req.params;
        const category = await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success : true,
            message : "deleted category successfully ",
            category
        })
      } catch (error) {
        console.log(error);
            return res.status(500).send({
                success : false,
                message : " problem in delete category Controller",
            })
        
      }

 }

module.exports = {createCategoryController ,  updateCategoryController , categoryController ,  singleCategoryController , deleteCategoryController};