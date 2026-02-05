const Company = require('./company.model');
const Lead = require('../leads/lead.model');

const list = async (query) => {
  const { page = 1, limit = 10, search } = query;
  const skip = (Number(page) - 1) * Number(limit);
  const filter = {};
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { name: regex },
      { industry: regex },
      { location: regex },
    ];
  }
  const [companies, total] = await Promise.all([
    Company.find(filter).sort({ name: 1 }).skip(skip).limit(Number(limit)).lean(),
    Company.countDocuments(filter),
  ]);
  return { companies, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) };
};

const getById = async (id) => {
  const company = await Company.findById(id).lean();
  if (!company) throw new Error('Company not found');
  const leads = await Lead.find({ company: id, isDeleted: false }).populate('assignedTo', 'name email').lean();
  return { ...company, leads };
};

const create = async (data) => {
  return Company.create(data);
};

module.exports = { list, getById, create };
