const mongoose = require('mongoose')
const Type = require('../models/Type')
const Product = require('../models/Product')

async function getTypes(req, res) {
  try {
    const types = await Type.find()
    res.status(200).json(types)
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

async function getType(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this type is not valid.")

  try {
    const type = await Type.find({_id: id})
    if (!type) throw Error("This type doesn't exists.")
    res.status(200).json(type)
  } 
  catch (error) {
    res.status(400).json({error: error.message})
  }
}

async function postType(req, res) {
  try {
    const type = await Type.create(req.body)
    res.status(200).json(type)
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

async function updateType(req, res) {
  const { id } = req.params
  const { imageUrl } = req.body
  let emptyFields = []

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this type is not valid.")

  if (imageUrl === "") emptyFields.push("Image")

  try {
    const type = await Type.findOneAndUpdate({_id: id}, {...req.body})
    if (!type) throw Error("This type doesn't exists.")
    res.status(200).json(type)
  }
  catch(error) {
    res.status(400).json({error: error.message, emptyFields})
  }
}

async function deleteType(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this type is not valid.")

  try {
    const type = await Type.findOneAndDelete({_id: id})

    if (!type) throw Error("This type doesn't exists.")

    const products = await Product.find({typeId: id})
    if (!products) {
      throw Error("These products doesn't exists.")
    }
    else {
      for (let product of products) {
        product = await Product.findOneAndUpdate({_id: product._id}, {
          $pull: { typeId: product.typeId }
        })
      }
    }

    res.status(200).json(type)
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = {
  getTypes,
  getType,
  postType,
  updateType,
  deleteType
}