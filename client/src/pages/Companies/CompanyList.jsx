import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { fetchList, create } from '../../store/companies/companyAction';
import { setPage } from '../../store/companies/companySlice';
import DataTable from '../../components/common/DataTable';
import AppButton from '../../components/common/AppButton';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

const COLUMNS = [
  { id: 'name', label: 'Company Name', minWidth: 160 },
  { id: 'industry', label: 'Industry', minWidth: 120 },
  { id: 'location', label: 'Location', minWidth: 120 },
  { id: 'actions', label: 'Actions', minWidth: 80, align: 'right' },
];

export default function CompanyList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies, total, page, loading, error } = useSelector((state) => state.companies);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', industry: '', location: '' });

  useEffect(() => {
    dispatch(fetchList({ page, limit: 10 }));
  }, [dispatch, page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await dispatch(create(form));
    setOpen(false);
    setForm({ name: '', industry: '', location: '' });
    dispatch(fetchList({ page, limit: 10 }));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
        Companies
      </Typography>
      <ErrorAlert message={error} onClose={() => dispatch({ type: 'companies/clearError' })} />
      <Box sx={{ mb: 2 }}>
        <AppButton variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Company
        </AppButton>
      </Box>
      <DataTable
        columns={COLUMNS}
        rows={companies}
        loading={loading}
        loadingComponent={<Loader />}
        total={total}
        page={page}
        rowsPerPage={10}
        onPageChange={(p) => dispatch(setPage(p))}
        emptyMessage="No companies found"
        renderRow={(row) => (
          <TableRow key={row._id} hover sx={{ transition: 'background-color 0.15s ease' }}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.industry || '—'}</TableCell>
            <TableCell>{row.location || '—'}</TableCell>
            <TableCell align="right">
              <IconButton size="small" onClick={() => navigate(`/companies/${row._id}`)} aria-label="View">
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        )}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle>Add Company</DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent>
            <TextField
              fullWidth
              label="Company Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Industry"
              value={form.industry}
              onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              margin="normal"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <AppButton variant="outlined" color="secondary" onClick={() => setOpen(false)}>Cancel</AppButton>
            <AppButton type="submit" variant="contained">Save</AppButton>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
