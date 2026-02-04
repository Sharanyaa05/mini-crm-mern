import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Paper } from '@mui/material';
import { create } from '../../store/companies/companyAction';
import AppButton from '../../components/common/AppButton';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function CompanyForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.companies);
  const [form, setForm] = useState({ name: '', industry: '', location: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const result = await dispatch(create(form));
    if (create.fulfilled.match(result)) {
      navigate('/companies');
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
        Add Company
      </Typography>
      <ErrorAlert message={error} onClose={() => dispatch({ type: 'companies/clearError' })} />
      <Paper sx={{ p: 3, maxWidth: 560 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Company Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Industry"
            name="industry"
            value={form.industry}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            margin="normal"
          />
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <AppButton type="submit" variant="contained" disabled={loading}>
              Save
            </AppButton>
            <AppButton variant="outlined" color="secondary" onClick={() => navigate('/companies')}>
              Cancel
            </AppButton>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
