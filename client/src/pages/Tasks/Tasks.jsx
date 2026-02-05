import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  TableCell,
  TableRow,
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
import AddIcon from '@mui/icons-material/Add';
import { fetchList, create, updateStatus } from '../../store/tasks/taskAction';
import { setPage } from '../../store/tasks/taskSlice';
import { getUsers } from '../../store/auth/authAction';
import { fetchList as fetchLeads } from '../../store/leads/leadsAction';
import SearchInput from '../../components/common/SearchInput';
import DataTable from '../../components/common/DataTable';
import AppButton from '../../components/common/AppButton';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');

const COLUMNS = [
  { id: 'title', label: 'Title', minWidth: 120 },
  { id: 'lead', label: 'Lead', minWidth: 120 },
  { id: 'dueDate', label: 'Due Date', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 100 },
  { id: 'assignedTo', label: 'Assigned To', minWidth: 120 },
  { id: 'actions', label: 'Actions', minWidth: 140, align: 'right' },
];

export default function Tasks() {
  const dispatch = useDispatch();
  const { tasks, total, page, loading, error } = useSelector((state) => state.tasks);
  const { user, users } = useSelector((state) => state.auth);
  const { leads } = useSelector((state) => state.leads);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', lead: '', dueDate: '', assignedTo: '' });

  useEffect(() => {
    dispatch(getUsers());
    dispatch(fetchLeads({ limit: 500 }));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchList({ page, limit: 10, search: search || undefined }));
  }, [dispatch, page, search]);

  const handleSearch = (value) => {
    setSearch(value ?? search);
    dispatch(setPage(1));
    dispatch(fetchList({ page: 1, limit: 10, search: (value ?? search) || undefined }));
  };

  const handleCreate = () => {
    setForm({ title: '', lead: '', dueDate: '', assignedTo: user?._id || '' });
    setOpen(true);
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!form.title || !form.lead || !form.dueDate || !form.assignedTo) return;
    await dispatch(create({
      title: form.title,
      lead: form.lead,
      dueDate: form.dueDate,
      assignedTo: form.assignedTo,
    }));
    setOpen(false);
    dispatch(fetchList({ page, limit: 10, search: search || undefined }));
  };

  const handleStatusChange = async (task, newStatus) => {
    const assignedId = task.assignedTo?._id || task.assignedTo;
    if (assignedId !== user?._id) {
      alert('Only the assigned user can update this task status.');
      return;
    }
    await dispatch(updateStatus({ id: task._id, status: newStatus }));
  };

  const canUpdateTask = (task) => {
    const assignedId = task.assignedTo?._id || task.assignedTo;
    return assignedId === user?._id;
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
        Tasks
      </Typography>
      <ErrorAlert message={error} onClose={() => dispatch({ type: 'tasks/clearError' })} />
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput
          value={search}
          onChange={setSearch}
          onSearch={handleSearch}
          placeholder="Search by task title... Press Enter"
          showButton={false}
          sx={{ flex: '1 1 220px' }}
        />
        <AppButton variant="contained" startIcon={<AddIcon />} onClick={handleCreate}>
          Add Task
        </AppButton>
      </Box>

      <DataTable
        columns={COLUMNS}
        rows={tasks}
        loading={loading}
        loadingComponent={<Loader />}
        total={total}
        page={page}
        rowsPerPage={10}
        onPageChange={(p) => dispatch(setPage(p))}
        emptyMessage="No tasks found"
        renderRow={(row) => (
          <TableRow key={row._id} hover sx={{ transition: 'background-color 0.15s ease' }}>
            <TableCell>{row.title}</TableCell>
            <TableCell>{row.lead?.name || '—'}</TableCell>
            <TableCell>{formatDate(row.dueDate)}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.assignedTo?.name || '—'}</TableCell>
            <TableCell align="right">
              {canUpdateTask(row) && row.status !== 'Done' && (
                <AppButton
                  size="small"
                  variant="outlined"
                  onClick={() => handleStatusChange(row, 'Done')}
                >
                  Done
                </AppButton>
              )}
              {!canUpdateTask(row) && (
                <Typography variant="caption" color="text.secondary">
                  Only assigned user can update
                </Typography>
              )}
            </TableCell>
          </TableRow>
        )}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
        <DialogTitle>Add Task</DialogTitle>
        <form onSubmit={handleSubmitTask}>
          <DialogContent>
            <TextField
              fullWidth
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              margin="normal"
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Lead</InputLabel>
              <Select
                value={form.lead}
                label="Lead"
                onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
              >
                <MenuItem value="">—</MenuItem>
                {leads.map((l) => (
                  <MenuItem key={l._id} value={l._id}>{l.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              required
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Assigned To</InputLabel>
              <Select
                value={form.assignedTo}
                label="Assigned To"
                onChange={(e) => setForm((f) => ({ ...f, assignedTo: e.target.value }))}
              >
                <MenuItem value="">—</MenuItem>
                {users.map((u) => (
                  <MenuItem key={u._id} value={u._id}>{u.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
