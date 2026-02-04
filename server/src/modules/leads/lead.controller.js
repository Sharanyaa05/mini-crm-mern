const leadService = require('./lead.service');

const list = async (req, res, next) => {
  try {
    const result = await leadService.list(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const lead = await leadService.getById(req.params.id);
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const lead = await leadService.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const lead = await leadService.update(req.params.id, req.body);
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    await leadService.softDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const lead = await leadService.updateStatus(req.params.id, req.body.status);
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove, updateStatus };
