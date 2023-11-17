const mongoose = require('mongoose')
const Category = require('../models/Category')  
const Banner = require('../models/Banner')
const Subcategory = require('../models/Subcategory')
const Product = require('../models/Product')

async function getCategories(req, res) {
  try {
    const categories = await Category.find()
    res.status(200).json(categories)
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

async function getCategory(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this category is not valid.")

  try {
    const category = await Category.find({_id: id})
    if (!category) throw Error("This category doesn't exists.")
    res.status(200).json(category)
  } 
  catch (error) {
    res.status(400).json({error: error.message})
  }
}

async function postCategory(req, res) {
  const { name, imageUrl } = req.body
  let emptyFields = []

  if (name === "") emptyFields.push("Name")
  if (imageUrl === "") emptyFields.push("Image")

  try {
    const category = await Category.create({...req.body})
    res.status(200).json(category)
  }
  catch(error) {
    res.status(400).json({error: error.message, emptyFields})
  }
}

async function updateCategory(req, res) {
  const { id } = req.params
  const { name, imageUrl } = req.body
  let emptyFields = []

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this category is not valid.")

  if (name === "") emptyFields.push("Name")
  if (imageUrl === "") emptyFields.push("Image")

  try {
    const category = await Category.findOneAndUpdate({_id: id}, {...req.body})
    if (!category) throw Error("This category doesn't exists.")
    res.status(200).json(category)
  }
  catch(error) {
    res.status(400).json({error: error.message, emptyFields})
  }
}

async function deleteCategory(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this category is not valid.")

  try {
    const category = await Category.findOneAndDelete({_id: id})
    if (!category) throw Error("This category doesn't exists.")
    
    const banner = await Banner.findOneAndDelete({categoryId: id})
    if (!banner) throw Error("This banner doesn't exists.")
    
    const subcategories = await Subcategory.find({categoryId: id})
    if (!subcategories) {
      throw Error("These subcategories doesn't exists.")
    }
    else {
      for (let subcategory of subcategories) {
        subcategory = await Subcategory.findOneAndDelete({_id: subcategory._id})
      }
    }

    const products = await Product.find({categoryId: id})
    if (!products) {
      throw Error("These products doesn't exists.")
    }
    else {
      for (let product of products) {
        product = await Product.findOneAndUpdate({_id: product._id}, {
          $pull: { categoryId: product.categoryId }
        })
      }
    }

    res.status(200).json(category)
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = {
  getCategories,
  getCategory,
  postCategory,
  updateCategory,
  deleteCategory
}