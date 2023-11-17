const mongoose = require('mongoose')
const Product = require('../models/Product')
const Category = require('../models/Category')
const Subcategory = require('../models/Subcategory')
const Type = require('../models/Type')

async function getProducts(req, res) {
  try {
    const products = await Product.find()
    res.status(200).json(products)
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

async function getProduct(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("The ID of this product is not valid.")

  try {
    const product = await Product.find({_id: id})
    if (!product) throw new Error("This product doesn't exists.")
    res.status(200).json(product)
  } 
  catch (error) {
    res.status(400).json({error: error.message})
  }
}

async function postProduct(req, res) {
  const {
    name,
    description,
    imagesUrls,
    currentPrice,
    oldPrice,
    typeId,
    categoryId,
    subcategoryId,
    slug
  } = req.body
  let emptyFields = []

  if (name === "") emptyFields.push("Name")
  if (description === "") emptyFields.push("Description")
  if (imagesUrls === "") emptyFields.push("Images")
  if (currentPrice === "") emptyFields.push("Current Price")
  if (oldPrice === "") emptyFields.push("Old Price")
  if (typeId === "") emptyFields.push("Type")
  if (categoryId === "") emptyFields.push("Category")
  if (subcategoryId === "") emptyFields.push("Subcategory")

  const newProduct = {
    name,
    description,
    imagesUrls,
    currentPrice,
    oldPrice,
    typeId,
    categoryId,
    subcategoryId,
    slug
  }

  try {
    const product = await Product.create(newProduct)
    if (emptyFields > 0) throw new Error ("All the fields must be filled in.")

    const category = await Category.findOneAndUpdate({_id: categoryId}, {
      $push: { productsIds: product._id }
    })

    const subcategory = await Subcategory.findOneAndUpdate({_id: subcategoryId}, {
      $push: { productsIds: product._id }
    })

    const type = await Type.findOneAndUpdate({_id: typeId}, {
      $push: { productsIds: product._id }
    })

    res.status(200).json(product)
  }
  catch(error) {
    res.status(400).json({error: error.message, emptyFields})
  }
}

async function updateProduct(req, res) {
  const { id } = req.params
  const {
    name,
    description,
    imagesUrls,
    currentPrice,
    oldPrice,
    typeId,
    categoryId,
    subcategoryId,
    slug
  } = req.body
  let emptyFields = []

  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("The ID of this product is not valid.")

  if (name === "") emptyFields.push("Name")
  if (description === "") emptyFields.push("Description")
  if (imagesUrls === "") emptyFields.push("Images")
  if (currentPrice === "") emptyFields.push("Current Price")
  if (oldPrice === "") emptyFields.push("Old Price")
  if (typeId === "") emptyFields.push("Type")
  if (categoryId === "") emptyFields.push("Category")
  if (subcategoryId === "") emptyFields.push("Subcategory")

  const newProduct = {
    name,
    description,
    imagesUrls,
    currentPrice,
    oldPrice,
    typeId,
    categoryId,
    subcategoryId,
    slug
  }

  try {
    const oldProduct = await Product.findById(id)
    if (!oldProduct) throw new Error("This product doesn't exists.")

    const product = await Product.findOneAndUpdate({_id: id}, newProduct)
    if (!product) throw new Error("This product doesn't exists.")

    const category = await Category.findOneAndUpdate({_id: categoryId}, {
      $push: { productsIds: product._id }
    })
    if (categoryId !== oldProduct.categoryId) {
      const oldCategory = await Category.findOneAndUpdate({_id: categoryId}, {
        $pull: { productsIds: oldProduct._id }
      })
    }

    const subcategory = await Subcategory.findOneAndUpdate({_id: subcategoryId}, {
      $push: { productsIds: product._id }
    })
    if (subcategoryId !== oldProduct.subcategoryId) {
      const oldSubcategory = await Subcategory.findOneAndUpdate({_id: oldProduct.subcategoryId}, {
        $pull: { productsIds: oldProduct._id }
      })
    }

    const type = await Type.findOneAndUpdate({_id: oldProduct.typeId}, {
      $push: { productsIds: product._id }
    })
    if (typeId !== oldProduct.typeId) {
      const oldType = await Type.findOneAndUpdate({_id: oldProduct.typeId}, {
        $pull: { productsIds: oldProduct._id }
      })
    }

    res.status(200).json(product)
  }
  catch(error) {
    res.status(400).json({error: error.message, emptyFields})
  }
}

async function deleteProduct(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw new Error("The ID of this product is not valid.")

  try {
    const product = await Product.findOneAndDelete({_id: id})
    if (!product) throw new Error("This product doesn't exists.")
    
    const category = await Category.findOneAndUpdate({_id: product.categoryId}, {
      $pull: { productsIds: product._id }
    })

    const subcategory = await Subcategory.findOneAndUpdate({_id: product.subcategoryId}, {
      $pull: { productsIds: product._id }
    })
    
    const type = await Type.findOneAndUpdate({_id: product.typeId}, {
      $pull: { productsIds: product._id }
    })

    res.status(200).json(product)
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = {
  getProducts,
  getProduct,
  postProduct,
  updateProduct,
  deleteProduct
}