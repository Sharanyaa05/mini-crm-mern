import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TableCell,
  TableRow,
  IconButton,
  Menu,
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { fetchList, create, remove, updateStatus } from '../../store/leads/leadsAction';
import { setPage } from '../../store/leads/leadsSlice';
import { getUsers } from '../../store/auth/authAction';
import { fetchList as fetchCompanies } from '../../store/companies/companyAction';
import { LEAD_STATUSES } from '../../utils/constants';
import SearchInput from '../../components/common/SearchInput';
import DataTable from '../../components/common/DataTable';
import AppButton from '../../components/common/AppButton';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import EditLeadDialog from '../../components/common/EditLeadDialog';

const COLUMNS = [
  { id: 'name', label: 'Name', minWidth: 120 },
  { id: 'email', label: 'Email', minWidth: 160 },
  { id: 'status', label: 'Status', minWidth: 120 },
  { id: 'assignedTo', label: 'Assigned To', minWidth: 120 },
  { id: 'actions', label: 'Actions', minWidth: 80, align: 'right' },
];

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  status: 'New',
  assignedTo: '',
  company: '',
};

export default function LeadsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leads, total, page, loading, error } = useSelector((state) => state.leads);
  const { users } = useSelector((state) => state.auth);
  const { companies } = useSelector((state) => state.companies);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);
  const [actionAnchor, setActionAnchor] = useState(null);
  const [actionRow, setActionRow] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editLeadId, setEditLeadId] = useState(null);

  useEffect(() => {
    dispatch(fetchList({ page, limit: 10, search: search || undefined, status: statusFilter || undefined }));
  }, [dispatch, page, search, statusFilter]);

  useEffect(() => {
    if (open) {
      dispatch(getUsers());
      dispatch(fetchCompanies({ limit: 500 }));
    }
  }, [open, dispatch]);

  const handleSearch = (value) => {
    setSearch(value ?? search);
    dispatch(setPage(1));
    dispatch(fetchList({ page: 1, limit: 10, search: (value ?? search) || undefined, status: statusFilter || undefined }));
  };

  const handleStatusChange = async (id, status) => {
    await dispatch(updateStatus({ id, status }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      assignedTo: form.assignedTo || undefined,
      company: form.company || undefined,
    };
    await dispatch(create(payload));
    setOpen(false);
    setForm(INITIAL_FORM);
    dispatch(fetchList({ page, limit: 10, search: search || undefined, status: statusFilter || undefined }));
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setForm(INITIAL_FORM);
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
    if (actionRow) navigate(`/leads/${actionRow._id}`);
    handleActionMenuClose();
  };

  const handleEdit = () => {
    if (actionRow) {
      setEditLeadId(actionRow._id);
      setEditDialogOpen(true);
    }
    handleActionMenuClose();
  };

  const handleDeleteFromMenu = () => {
    if (actionRow) {
      if (window.confirm('Soft delete this lead?')) {
        dispatch(remove(actionRow._id));
        dispatch(fetchList({ page, limit: 10, search: search || undefined, status: statusFilter || undefined }));
      }
    }
    handleActionMenuClose();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
        Leads
      </Typography>
      <ErrorAlert message={error} onClose={() => dispatch({ type: 'leads/clearError' })} />
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
          placeholder="Search by name or email... Press Enter"
          showButton={false}
          sx={{ flex: '1 1 220px' }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => {
              setStatusFilter(e.target.value);
              dispatch(setPage(1));
            }}
          >
            <MenuItem value="">All</MenuItem>
            {LEAD_STATUSES.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <AppButton variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Lead
        </AppButton>
      </Box>

      <DataTable
        columns={COLUMNS}
        rows={leads}
        loading={loading}
        loadingComponent={<Loader />}
        total={total}
        page={page}
        rowsPerPage={10}
        onPageChange={(p) => dispatch(setPage(p))}
        emptyMessage="No leads found"
        renderRow={(row) => (
          <TableRow key={row._id} hover sx={{ transition: 'background-color 0.15s ease' }}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>
              <Select
                size="small"
                value={row.status}
                onChange={(e) => handleStatusChange(row._id, e.target.value)}
                sx={{ minWidth: 120 }}
              >
                {LEAD_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </TableCell>
            <TableCell>{row.assignedTo?.name || '—'}</TableCell>
            <TableCell align="right">
              <IconButton
                size="small"
                onClick={(e) => handleActionMenuOpen(e, row)}
                aria-label="More options"
                aria-haspopup="true"
                aria-controls={actionAnchor ? 'lead-row-menu' : undefined}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                id="lead-row-menu"
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
                <MenuItem onClick={handleEdit}>
                  <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteFromMenu} sx={{ color: 'error.main' }}>
                  <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
                  <ListItemText>Delete</ListItemText>
                </MenuItem>
              </Menu>
            </TableCell>
          </TableRow>
        )}
      />

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle>Add Lead</DialogTitle>
        <form onSubmit={handleCreate}>
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
            <AppButton type="button" variant="outlined" color="secondary" onClick={handleCloseDialog}>Cancel</AppButton>
            <AppButton type="submit" variant="contained" disabled={loading}>Save</AppButton>
          </DialogActions>
        </form>
      </Dialog>

      <EditLeadDialog
        leadId={editLeadId}
        open={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false);
          setEditLeadId(null);
        }}
        onSaved={() => dispatch(fetchList({ page, limit: 10, search: search || undefined, status: statusFilter || undefined }))}
      />
    </Box>
  );
}
