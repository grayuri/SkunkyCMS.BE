const express = require('express')
const router = express.Router()
const bannersController = require('../controllers/banners')

router.get('/', bannersController.getBanners)
router.get('/:id', bannersController.getBanner)
router.post('/', bannersController.postBanner)
router.patch('/:id', bannersController.updateBanner)
router.delete('/:id', bannersController.deleteBanner)

module.exports = router