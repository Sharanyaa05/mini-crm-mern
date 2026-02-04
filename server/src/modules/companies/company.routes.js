const express = require('express');
const companyController = require('./company.controller');
const { protect } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);

router.get('/', companyController.list);
router.get('/:id', companyController.getById);
router.post('/', companyController.create);

module.exports = router;
