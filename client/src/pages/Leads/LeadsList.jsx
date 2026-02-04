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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { fetchList, remove, updateStatus } from '../../store/leads/leadsAction';
import { setPage } from '../../store/leads/leadsSlice';
import { LEAD_STATUSES } from '../../utils/constants';
import SearchInput from '../../components/common/SearchInput';
import DataTable from '../../components/common/DataTable';
import AppButton from '../../components/common/AppButton';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

const COLUMNS = [
  { id: 'name', label: 'Name', minWidth: 120 },
  { id: 'email', label: 'Email', minWidth: 160 },
  { id: 'status', label: 'Status', minWidth: 120 },
  { id: 'assignedTo', label: 'Assigned To', minWidth: 120 },
  { id: 'actions', label: 'Actions', minWidth: 120, align: 'right' },
];

export default function LeadsList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leads, total, page, loading, error } = useSelector((state) => state.leads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchList({ page, limit: 10, search: search || undefined, status: statusFilter || undefined }));
  }, [dispatch, page, search, statusFilter]);

  const handleSearch = (value) => {
    setSearch(value ?? search);
    dispatch(setPage(1));
    dispatch(fetchList({ page: 1, limit: 10, search: (value ?? search) || undefined, status: statusFilter || undefined }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Soft delete this lead?')) return;
    await dispatch(remove(id));
    dispatch(fetchList({ page, limit: 10, search: search || undefined, status: statusFilter || undefined }));
  };

  const handleStatusChange = async (id, status) => {
    await dispatch(updateStatus({ id, status }));
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
          placeholder="Search by name or email"
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
        <AppButton variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/leads/new')}>
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
              <IconButton size="small" onClick={() => navigate(`/leads/${row._id}`)} aria-label="Edit">
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => handleDelete(row._id)} aria-label="Delete">
                <DeleteIcon fontSize="small" />
              </IconButton>
            </TableCell>
          </TableRow>
        )}
      />
    </Box>
  );
}
