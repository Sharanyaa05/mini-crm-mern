const Lead = require('../leads/lead.model');
const Task = require('../tasks/task.model');

const getStats = async (userId) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const [totalLeads, qualifiedLeads, completedTasks, pendingTasks, tasksDueToday] = await Promise.all([
    Lead.countDocuments({ isDeleted: false }),
    Lead.countDocuments({ isDeleted: false, status: 'Qualified' }),
    Task.countDocuments({ assignedTo: userId, status: 'Done' }),
    Task.countDocuments({ assignedTo: userId, status: { $in: ['Pending', 'In Progress'] } }),
    Task.countDocuments({
      assignedTo: userId,
      dueDate: { $gte: startOfToday, $lte: endOfToday },
      status: { $ne: 'Done' },
    }),
  ]);

  return {
    totalLeads,
    qualifiedLeads,
    completedTasks,
    pendingTasks,
    tasksDueToday,
  };
};

module.exports = { getStats };
