const taskService = require('./task.service');

const list = async (req, res, next) => {
  try {
    const result = await taskService.list(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const task = await taskService.getById(req.params.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const task = await taskService.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const task = await taskService.updateStatus(req.params.id, req.body.status, req.user.id);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, updateStatus };
