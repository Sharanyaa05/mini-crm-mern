import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppButton from '../../components/common/AppButton';
import { fetchOne } from '../../store/companies/companyAction';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { company, loading, error } = useSelector((state) => state.companies);

  useEffect(() => {
    if (id) dispatch(fetchOne(id));
  }, [dispatch, id]);

  if (loading && !company) return <Loader />;

  return (
    <Box>
      <AppButton variant="text" color="secondary" startIcon={<ArrowBackIcon />} onClick={() => navigate('/companies')} sx={{ mb: 2 }}>
        Back
      </AppButton>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Company Details
      </Typography>
      <ErrorAlert message={error} onClose={() => dispatch({ type: 'companies/clearError' })} />
      {company && (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary">Company Name</Typography>
            <Typography variant="h6">{company.name}</Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Industry</Typography>
            <Typography>{company.industry || '-'}</Typography>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Location</Typography>
            <Typography>{company.location || '-'}</Typography>
          </Paper>
          <Typography variant="h6" gutterBottom>Associated Leads</Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {company.leads?.length ? (
                  company.leads.map((lead) => (
                    <TableRow key={lead._id}>
                      <TableCell>{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.status}</TableCell>
                      <TableCell>{lead.assignedTo?.name || '-'}</TableCell>
                      <TableCell align="right">
                        <AppButton size="small" variant="text" onClick={() => navigate(`/leads/${lead._id}`)}>
                          View
                        </AppButton>
                        <AppButton size="small" variant="outlined" onClick={() => navigate(`/leads/${lead._id}/edit`)}>
                          Edit
                        </AppButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>No leads associated</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
