const mongoose = require('mongoose')
const Schema = mongoose.Schema

const subcategorySchema = new Schema({
  name: { type: String, required: true },
  categoryId: { type: String, required: true},
  productsIds: [{ type: String }]
})

const Subcategory = mongoose.model('Subcategory', subcategorySchema)

module.exports = Subcategory