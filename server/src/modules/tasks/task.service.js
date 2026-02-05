const Task = require('./task.model');

const list = async (query) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const filter = {};
  if (search && search.trim()) {
    filter.title = new RegExp(search.trim(), 'i');
  }
  const [tasks, total] = await Promise.all([
    Task.find(filter).populate('lead', 'name email').populate('assignedTo', 'name email').sort({ dueDate: 1 }).skip(skip).limit(Number(limit)).lean(),
    Task.countDocuments(filter),
  ]);
  return { tasks, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) };
};

const getById = async (id) => {
  const task = await Task.findById(id).populate('lead', 'name email').populate('assignedTo', 'name email').lean();
  if (!task) throw new Error('Task not found');
  return task;
};

const create = async (data) => {
  return Task.create(data);
};

const updateStatus = async (id, status, userId) => {
  const task = await Task.findById(id);
  if (!task) throw new Error('Task not found');
  if (task.assignedTo.toString() !== userId.toString()) {
    throw new Error('Only the assigned user can update this task status');
  }
  task.status = status;
  await task.save();
  return Task.findById(id).populate('lead', 'name email').populate('assignedTo', 'name email').lean();
};

module.exports = { list, getById, create, updateStatus };
