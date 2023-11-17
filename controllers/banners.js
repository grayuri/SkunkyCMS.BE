const mongoose = require('mongoose')
const Banner = require('../models/Banner')

async function getBanners (req, res) {
  try {
    const banners = await Banner.find()
    res.status(200).json(banners)
  } 
  catch (error) {
    res.status(400).json({error: error.message})
  }
}

async function getBanner (req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this banner is not valid.")

  try {
    const banner = await Banner.findOneById(id)
    res.status(200).json(banner)
  } 
  catch (error) {
    res.status(400).json({error: error.message})
  }
}

async function postBanner (req, res) {
  try {
    const banner = await Banner.create({...req.body})
    res.status(200).json(banner)
  } 
  catch (error) {
    res.status(400).json({error: error.message})
  }
}

async function updateBanner (req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this banner is not valid.")

  const { imageUrl } = req.body

  if (imageUrl === "") throw Error("The Image field must be filled in.")

  try {
    const banner = await Banner.findOneAndUpdate({_id: id}, {...req.body})
    res.status(200).json(banner)
  } 
  catch (error) {
    res.status(400).json({error: error.message})
  }
}

async function deleteBanner(req, res) {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) throw Error("The ID of this banner is not valid.")

  try {
    const banner = await Banner.findOneAndDelete({_id: id})
    if (!banner) throw Error("This banner doesn't exists.")
    res.status(200).json(banner)
  }
  catch(error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = {
  getBanners,
  getBanner,
  postBanner,
  updateBanner,
  deleteBanner
}