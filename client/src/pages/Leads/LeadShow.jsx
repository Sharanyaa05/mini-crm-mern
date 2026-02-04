import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { fetchOne } from '../../store/leads/leadsAction';
import LeadDetail from '../../components/common/LeadDetail';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';
import AppButton from '../../components/common/AppButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function LeadShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { lead, loading, error } = useSelector((state) => state.leads);

  useEffect(() => {
    if (id) dispatch(fetchOne(id));
  }, [dispatch, id]);

  if (loading && !lead) return <Loader />;

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          px: 0,
          py: 1,
          mb: 2,
        }}
      >
        <AppButton
          variant="text"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/leads')}
        >
          Back
        </AppButton>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          px: 2,
        }}
      >
        <ErrorAlert message={error} onClose={() => dispatch({ type: 'leads/clearError' })} />
        {lead && <LeadDetail lead={lead} />}
      </Box>
    </Box>
  );
}
