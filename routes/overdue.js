const express = require('express');
const router = express.Router();
const fineController = require('../controllers/fineController');

// GET overdue members page
router.get('/', fineController.overdueView);

// API endpoint for overdue members
router.get('/api', fineController.getOverdueMembers);

// Send reminder to member
router.post('/reminder/:memberId', fineController.sendReminder);

// Mark fine as paid
router.post('/mark-paid/:memberId', fineController.markPaid);

module.exports = router;