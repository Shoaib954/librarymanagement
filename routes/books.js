const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireAdmin } = require('../controllers/authController');

router.get('/', bookController.index);
router.get('/browse', bookController.browse);
router.get('/new', requireAdmin, bookController.new);
router.post('/', requireAdmin, bookController.create);
router.get('/:id', bookController.show);
router.get('/:id/edit', requireAdmin, bookController.edit);
router.put('/:id', requireAdmin, bookController.update);
router.delete('/:id', requireAdmin, bookController.destroy);

module.exports = router;