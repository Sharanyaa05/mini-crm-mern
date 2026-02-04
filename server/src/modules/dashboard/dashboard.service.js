const Lead = require('../leads/lead.model');
const Task = require('../tasks/task.model');

const getStats = async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [totalLeads, qualifiedLeads, tasksDueToday, completedTasks] = await Promise.all([
    Lead.countDocuments({ isDeleted: false }),
    Lead.countDocuments({ isDeleted: false, status: 'Qualified' }),
    Task.countDocuments({
      dueDate: { $gte: startOfToday, $lte: endOfToday },
      status: { $ne: 'Done' },
    }),
    Task.countDocuments({ status: 'Done' }),
  ]);

  return {
    totalLeads,
    qualifiedLeads,
    tasksDueToday,
    completedTasks,
  };
};

module.exports = { getStats };
