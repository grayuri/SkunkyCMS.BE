const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imagesUrls: [ { type: String, required: true } ],
  currentPrice: { type: String, required: true },
  oldPrice: { type: String, required: true },
  typeId: { type: String, required: true },
  categoryId: { type: String, required: true },
  subcategoryId: { type: String, required: true },
  slug: { type: String, required: true }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product