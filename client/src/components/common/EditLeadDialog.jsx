import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { fetchOne, update } from '../../store/leads/leadsAction';
import { getUsers } from '../../store/auth/authAction';
import { fetchList as fetchCompanies } from '../../store/companies/companyAction';
import { LEAD_STATUSES } from '../../utils/constants';
import AppButton from './AppButton';
import Loader from './Loader';

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  status: 'New',
  assignedTo: '',
  company: '',
};

export default function EditLeadDialog({ leadId, open, onClose, onSaved }) {
  const dispatch = useDispatch();
  const { lead, loading } = useSelector((state) => state.leads);
  const { users } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.companies);
  const [form, setForm] = useState(INITIAL_FORM);

  useEffect(() => {
    if (open && leadId) {
      dispatch(fetchOne(leadId));
      dispatch(getUsers());
      dispatch(fetchCompanies({ limit: 500 }));
    }
  }, [open, leadId, dispatch]);

  useEffect(() => {
    if (lead && open && lead._id === leadId) {
      setForm({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        status: lead.status || 'New',
        assignedTo: lead.assignedTo?._id || '',
        company: lead.company?._id || '',
      });
    } else if (!open) {
      setForm(INITIAL_FORM);
    }
  }, [lead, leadId, open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      assignedTo: form.assignedTo || undefined,
      company: form.company || undefined,
    };
    await dispatch(update({ id: leadId, data: payload }));
    onSaved?.();
    onClose();
  };

  const handleClose = () => {
    setForm(INITIAL_FORM);
    onClose();
  };

  const isLoading = open && (!lead || lead._id !== leadId);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle>Edit Lead</DialogTitle>
      {isLoading ? (
        <DialogContent sx={{ minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader />
        </DialogContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={form.status}
                label="Status"
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                {LEAD_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Assigned To</InputLabel>
              <Select
                name="assignedTo"
                value={form.assignedTo}
                label="Assigned To"
                onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
              >
                <MenuItem value="">—</MenuItem>
                {(users || []).map((u) => (
                  <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Company</InputLabel>
              <Select
                name="company"
                value={form.company}
                label="Company"
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              >
                <MenuItem value="">—</MenuItem>
                {(companies || []).map((c) => (
                  <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <AppButton type="button" variant="outlined" color="secondary" onClick={handleClose}>Cancel</AppButton>
            <AppButton type="submit" variant="contained" disabled={loading}>Save</AppButton>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
}
