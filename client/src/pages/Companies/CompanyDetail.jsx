import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Tabs,
  Tab,
  TableCell,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppButton from '../../components/common/AppButton';
import DataTable from '../../components/common/DataTable';
import { fetchOne } from '../../store/companies/companyAction';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

function DetailRow({ label, value }) {
  return (
    <Box sx={{ py: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1">{value || '—'}</Typography>
    </Box>
  );
}

const ASSOCIATED_LEADS_COLUMNS = [
  { id: 'name', label: 'Name', minWidth: 120 },
  { id: 'email', label: 'Email', minWidth: 160 },
  { id: 'status', label: 'Status', minWidth: 120 },
  { id: 'assignedTo', label: 'Assigned To', minWidth: 120 },
];

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { company, loading, error } = useSelector((state) => state.companies);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (id) dispatch(fetchOne(id));
  }, [dispatch, id]);

  if (loading && !company) return <Loader />;

  const leads = company?.leads ?? [];

  return (
    <Box>
      <AppButton
        variant="text"
        color="secondary"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/companies')}
        sx={{ mb: 2 }}
      >
        Back
      </AppButton>
      <ErrorAlert message={error} onClose={() => dispatch({ type: 'companies/clearError' })} />
      {company && (
        <Box>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
          >
            <Tab label="Company Details" id="company-detail-tab-0" aria-controls="company-detail-panel-0" />
            <Tab label="Associated Leads" id="company-detail-tab-1" aria-controls="company-detail-panel-1" />
          </Tabs>

          <Box
            role="tabpanel"
            hidden={tab !== 0}
            id="company-detail-panel-0"
            aria-labelledby="company-detail-tab-0"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              px: 2,
            }}
          >
            {tab === 0 && (
              <Box sx={{ width: '100%', maxWidth: 480 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    sx={{ mb: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
                  >
                    Company Details
                  </Typography>
                  <DetailRow label="Company Name" value={company.name} />
                  <Divider sx={{ my: 0.5 }} />
                  <DetailRow label="Industry" value={company.industry} />
                  <Divider sx={{ my: 0.5 }} />
                  <DetailRow label="Location" value={company.location} />
                </Paper>
              </Box>
            )}
          </Box>

          <Box
            role="tabpanel"
            hidden={tab !== 1}
            id="company-detail-panel-1"
            aria-labelledby="company-detail-tab-1"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              px: 2,
            }}
          >
            {tab === 1 && (
              <Box sx={{ width: '100%'}}>
                <DataTable
                  columns={ASSOCIATED_LEADS_COLUMNS}
                  rows={leads}
                  loading={false}
                  total={0}
                  page={1}
                  rowsPerPage={leads.length || 10}
                  emptyMessage="No leads associated"
                  renderRow={(row) => (
                    <TableRow key={row._id} hover sx={{ transition: 'background-color 0.15s ease' }}>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.status || '—'}</TableCell>
                      <TableCell>{row.assignedTo?.name || '—'}</TableCell>
                    </TableRow>
                  )}
                />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
