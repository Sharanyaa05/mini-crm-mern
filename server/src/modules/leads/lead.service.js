const Lead = require('./lead.model');

const list = async (query) => {
  const { page = 1, limit = 10, search = '', status = '' } = query;
  const filter = { isDeleted: false };
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [leads, total] = await Promise.all([
    Lead.find(filter).populate('assignedTo', 'name email').populate('company', 'name industry location').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
    Lead.countDocuments(filter),
  ]);
  return { leads, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) };
};

const getById = async (id) => {
  const lead = await Lead.findOne({ _id: id, isDeleted: false }).populate('assignedTo', 'name email').populate('company', 'name industry location').lean();
  if (!lead) throw new Error('Lead not found');
  return lead;
};

const create = async (data) => {
  return Lead.create(data);
};

const update = async (id, data) => {
  const lead = await Lead.findOneAndUpdate({ _id: id, isDeleted: false }, data, { new: true }).populate('assignedTo', 'name email').populate('company', 'name industry location').lean();
  if (!lead) throw new Error('Lead not found');
  return lead;
};

const softDelete = async (id) => {
  const lead = await Lead.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });
  if (!lead) throw new Error('Lead not found');
  return lead;
};

const updateStatus = async (id, status) => {
  const lead = await Lead.findOneAndUpdate({ _id: id, isDeleted: false }, { status }, { new: true }).populate('assignedTo', 'name email').populate('company', 'name industry location').lean();
  if (!lead) throw new Error('Lead not found');
  return lead;
};

module.exports = { list, getById, create, update, softDelete, updateStatus };
