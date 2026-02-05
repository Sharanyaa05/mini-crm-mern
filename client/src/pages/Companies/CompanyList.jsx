import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TableCell,
  TableRow,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fetchList, create } from '../../store/companies/companyAction';
import { setPage } from '../../store/companies/companySlice';
import SearchInput from '../../components/common/SearchInput';
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
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', industry: '', location: '' });
  const [actionAnchor, setActionAnchor] = useState(null);
  const [actionRow, setActionRow] = useState(null);

  useEffect(() => {
    dispatch(fetchList({ page, limit: 10, search: search || undefined }));
  }, [dispatch, page, search]);

  const handleSearch = (value) => {
    setSearch(value ?? search);
    dispatch(setPage(1));
    dispatch(fetchList({ page: 1, limit: 10, search: (value ?? search) || undefined }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await dispatch(create(form));
    setOpen(false);
    setForm({ name: '', industry: '', location: '' });
    dispatch(fetchList({ page, limit: 10, search: search || undefined }));
  };

  const handleActionMenuOpen = (e, row) => {
    e.stopPropagation();
    setActionAnchor(e.currentTarget);
    setActionRow(row);
  };

  const handleActionMenuClose = () => {
    setActionAnchor(null);
    setActionRow(null);
  };

  const handleViewDetails = () => {
    if (actionRow) navigate(`/companies/${actionRow._id}`);
    handleActionMenuClose();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
        Companies
      </Typography>
      <ErrorAlert message={error} onClose={() => dispatch({ type: 'companies/clearError' })} />
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
          placeholder="Search by name, industry, or location... Press Enter"
          showButton={false}
          sx={{ flex: '1 1 220px' }}
        />
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
              <IconButton
                size="small"
                onClick={(e) => handleActionMenuOpen(e, row)}
                aria-label="More options"
                aria-haspopup="true"
                aria-controls={actionAnchor ? 'company-row-menu' : undefined}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                id="company-row-menu"
                anchorEl={actionAnchor}
                open={Boolean(actionAnchor)}
                onClose={handleActionMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={handleViewDetails}>
                  <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>View details</ListItemText>
                </MenuItem>
              </Menu>
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
