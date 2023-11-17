const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bannerSchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String },
  categoryId: { type: String }
})

const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner