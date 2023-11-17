const express = require('express')
const router = express.Router()
const subcategoriesController = require('../controllers/subcategories')

router.get('/', subcategoriesController.getSubcategories)
router.get('/:id', subcategoriesController.getSubcategory)
router.post('/', subcategoriesController.postSubcategory)
router.patch('/:id', subcategoriesController.updateSubcategory)
router.delete('/:id', subcategoriesController.deleteSubcategory)

module.exports = router