const express = require('express');
const authRoutes = require('./auth.routes');
const leadRoutes = require('./lead.routes');
const companyRoutes = require('./company.routes');
const taskRoutes = require('./task.routes');
const dashboardRoutes = require('./dashboard.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.use('/companies', companyRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
