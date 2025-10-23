const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.get('/', memberController.index);
router.get('/new', memberController.new);
router.post('/', memberController.create);
router.get('/:id', memberController.show);
router.delete('/:id', memberController.destroy);

module.exports = router;