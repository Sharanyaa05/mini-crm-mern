const companyService = require('./company.service');

const list = async (req, res, next) => {
  try {
    const result = await companyService.list(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const company = await companyService.getById(req.params.id);
    res.json(company);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const company = await companyService.create(req.body);
    res.status(201).json(company);
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create };
