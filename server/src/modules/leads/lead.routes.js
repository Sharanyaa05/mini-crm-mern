const express = require('express');
const leadController = require('./lead.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', leadController.list);
router.get('/:id', leadController.getById);
router.post('/', leadController.create);
router.put('/:id', leadController.update);
router.patch('/:id/status', leadController.updateStatus);
router.delete('/:id', leadController.remove);

module.exports = router;
