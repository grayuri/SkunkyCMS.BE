const mongoose = require(`mongoose`)
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: { type: String, required: true },
  imageUrl: { type: String, required: true },
  subcategoriesIds: [ { type: String } ],
  productsIds: [ { type: String } ],
  slug: { type: String, required: true }
})

const Category = mongoose.model('Category', categorySchema)

module.exports = Category