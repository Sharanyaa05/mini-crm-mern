const dashboardService = require('./dashboard.service');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
