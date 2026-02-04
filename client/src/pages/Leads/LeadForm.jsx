import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import AppButton from '../../components/common/AppButton';
import { create, update, fetchOne } from '../../store/leads/leadsAction';
import { clearLead } from '../../store/leads/leadsSlice';
import { getUsers } from '../../store/auth/authAction';
import { fetchList as fetchCompanies } from '../../store/companies/companyAction';
import { LEAD_STATUSES } from '../../utils/constants';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function LeadForm() {
  const { id } = useParams();
  const isEdit = id && id !== 'new';
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lead, loading, error } = useSelector((state) => state.leads);
  const { users } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.companies);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New',
    assignedTo: '',
    company: '',
  });

  useEffect(() => {
    dispatch(getUsers());
    dispatch(fetchCompanies({ limit: 500 }));
  }, [dispatch]);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchOne(id));
    } else {
      dispatch(clearLead());
    }
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        status: lead.status || 'New',
        assignedTo: lead.assignedTo?._id || '',
        company: lead.company?._id || '',
      });
    } else if (!isEdit) {
      setForm({
        name: '',
        email: '',
        phone: '',
        status: 'New',
        assignedTo: '',
        company: '',
      });
    }
  }, [lead, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      assignedTo: form.assignedTo || undefined,
      company: form.company || undefined,
    };
    if (isEdit) {
      await dispatch(update({ id, data: payload }));
    } else {
      await dispatch(create(payload));
    }
    navigate('/leads');
  };

  if (isEdit && loading && !lead) return <Loader />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        {isEdit ? 'Edit Lead' : 'Add Lead'}
      </Typography>
      <ErrorAlert message={error} onClose={() => dispatch({ type: 'leads/clearError' })} />
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={form.status} label="Status" onChange={handleChange}>
              {LEAD_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Assigned To</InputLabel>
            <Select name="assignedTo" value={form.assignedTo} label="Assigned To" onChange={handleChange}>
              <MenuItem value="">—</MenuItem>
              {users.map((u) => (
                <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Company</InputLabel>
            <Select name="company" value={form.company} label="Company" onChange={handleChange}>
              <MenuItem value="">—</MenuItem>
              {companies.map((c) => (
                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <AppButton type="submit" variant="contained" disabled={loading}>
              Save
            </AppButton>
            <AppButton variant="outlined" color="secondary" onClick={() => navigate('/leads')}>
              Cancel
            </AppButton>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
