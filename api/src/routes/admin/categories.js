const express = require('express');
const router = express.Router();
const {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory
} = require('../../controllers/adminCategoriesController');

router.get('/', adminGetCategories);
router.post('/', adminCreateCategory);
router.put('/:id', adminUpdateCategory);
router.delete('/:id', adminDeleteCategory);

module.exports = router;
