const express = require('express')
const router = express.Router()
const typesController = require('../controllers/types')

router.get('/', typesController.getTypes)
router.get('/:id', typesController.getType)
router.post('/', typesController.postType)
router.patch('/:id', typesController.updateType)
router.delete('/:id', typesController.deleteType)

module.exports = router