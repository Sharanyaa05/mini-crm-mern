import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { fetchStats } from '../../store/dashboard/dashboardAction';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

const statCards = [
  { key: 'totalLeads', label: 'Total Leads', icon: <PeopleIcon fontSize="large" /> },
  { key: 'qualifiedLeads', label: 'Qualified Leads', icon: <CheckCircleIcon fontSize="large" /> },
  { key: 'tasksDueToday', label: 'Tasks Due Today', icon: <AssignmentIcon fontSize="large" /> },
  { key: 'completedTasks', label: 'Completed Tasks', icon: <DoneAllIcon fontSize="large" /> },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading && !stats) return <Loader />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <ErrorAlert message={error} onClose={() => {}} />
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {statCards.map(({ key, label, icon }) => (
          <Grid item xs={12} sm={6} md={3} key={key}>
            <Card
              sx={{
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary" variant="body2" fontWeight={500}>
                    {label}
                  </Typography>
                  <Box sx={{ color: 'primary.main', opacity: 0.9 }}>{icon}</Box>
                </Box>
                <Typography variant="h4" sx={{ mt: 1.5 }} fontWeight={700}>
                  {stats ? stats[key] : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
