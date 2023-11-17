const express = require('express')
const router = express.Router()
const categoriesController = require('../controllers/categories')

router.get('/', categoriesController.getCategories)
router.get('/:id', categoriesController.getCategory)
router.post('/', categoriesController.postCategory)
router.patch('/:id', categoriesController.updateCategory)
router.delete('/:id', categoriesController.deleteCategory)

module.exports = router