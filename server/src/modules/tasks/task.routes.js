const express = require('express');
const taskController = require('./task.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', taskController.list);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
router.patch('/:id/status', taskController.updateStatus);

module.exports = router;
