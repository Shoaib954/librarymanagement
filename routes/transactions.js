const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', transactionController.index);
router.get('/issue', transactionController.issue);
router.post('/issue', transactionController.createIssue);
router.post('/:id/return', transactionController.return);

module.exports = router;