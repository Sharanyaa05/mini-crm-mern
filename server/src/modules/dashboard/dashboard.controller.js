const dashboardService = require('./dashboard.service');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats(req.user.id);
    res.json(stats);
  } catch (err) {
    next(err);
  }
};

module.exports = { getStats };
