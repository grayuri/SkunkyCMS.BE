const mongoose = require('mongoose')
const Subcategory = require('../models/Subcategory')
const Category = require('../models/Category')
const Product = require('../models/Product')

async function getSubcategories(req, res) {
  try {
    const subcategories = await Subcategory.find()
    res.status(200).json(subcategories)
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

async function getSubcategory(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this subcategory is not valid.")

  try {
    const subcategory = await Subcategory.find({_id: id})
    if (!subcategory) throw Error("This subcategory doesn't exists.")
    res.status(200).json(subcategory)
  } 
  catch (error) {
    res.status(400).json({error: error.message})
  }
}

async function postSubcategory(req, res) {
  const { name, categoryId } = req.body
  let emptyFields = []

  if (name === "") emptyFields.push("Name")
  if (categoryId === "") emptyFields.push("Category")

  try {
    const subcategory = await Subcategory.create({...req.body})
    const category = await Category.findOneAndUpdate({_id: categoryId}, {
      $push: { subcategoriesIds: subcategory._id }
    })
    res.status(200).json(subcategory)
  }
  catch(error) {
    res.status(400).json({error: error.message, emptyFields})
  }
}

async function updateSubcategory(req, res) {
  const { id } = req.params
  const { name, categoryId } = req.body
  let emptyFields = []
  
  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this subcategory is not valid.")
  
  if (name === "") emptyFields.push("Name")
  if (categoryId === "") emptyFields.push("Category")

  try {
    const subcategory = await Subcategory.findOneAndUpdate({_id: id}, {...req.body})
    if (!subcategory) throw Error("This subcategory doesn't exists.")
    res.status(200).json(subcategory)
  }
  catch(error) {
    res.status(400).json({error: error.message, emptyFields})
  }
}

async function deleteSubcategory(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this subcategory is not valid.")

  try {
    const subcategory = await Subcategory.findOneAndDelete({_id: id})
    if (!subcategory) throw Error("This subcategory doesn't exists.")
    
    const category = await Category.findOneAndUpdate({_id: subcategory.categoryId}, {
      $pull: { subcategoriesIds: subcategory._id }
    })
    if (!category) throw Error("This category doesn't exists.")
    
    const products = await Product.find({subcategoryId: id})
    if (!products) {
      throw Error("These products doesn't exists.")
    }
    else {
      for (let product of products) {
        product = await Product.findOneAndUpdate({_id: product._id}, {
          $pull: { subcategoryId: product.subcategoryId }
        })
      }
    }

    res.status(200).json(subcategory)
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = {
  getSubcategories,
  getSubcategory,
  postSubcategory,
  updateSubcategory,
  deleteSubcategory
}