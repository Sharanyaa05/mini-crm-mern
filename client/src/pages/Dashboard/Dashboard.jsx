import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import TodayIcon from '@mui/icons-material/Today';
import { fetchStats } from '../../store/dashboard/dashboardAction';
import Loader from '../../components/common/Loader';
import ErrorAlert from '../../components/common/ErrorAlert';

const statCards = [
  {
    key: 'totalLeads',
    label: 'Total Leads',
    description: 'All leads in your pipeline. Track and manage every contact.',
    icon: <PeopleIcon fontSize="large" />,
  },
  {
    key: 'qualifiedLeads',
    label: 'Qualified Leads',
    description: 'Leads ready for conversion. Focus on high-potential opportunities.',
    icon: <CheckCircleIcon fontSize="large" />,
  },
  {
    key: 'pendingTasks',
    label: 'Pending Tasks',
    description: 'Tasks assigned to you that are not yet done. Stay on top of your schedule.',
    icon: <AssignmentIcon fontSize="large" />,
  },
  {
    key: 'tasksDueToday',
    label: 'Tasks Due Today',
    description: 'Tasks assigned to you with a due date today. Get them done.',
    icon: <TodayIcon fontSize="large" />,
  },
  {
    key: 'completedTasks',
    label: 'Completed Tasks',
    description: 'Tasks assigned to you that are marked as done. Review your progress.',
    icon: <DoneAllIcon fontSize="large" />,
  },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (loading && !stats) return <Loader />;

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px - 48px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mb: 2 }}>
        Dashboard
      </Typography>
      <ErrorAlert message={error} onClose={() => {}} />
      <Grid container spacing={3} sx={{ flex: 1, alignContent: 'flex-start' }}>
        {statCards.map(({ key, label, description, icon }) => (
          <Grid item xs={12} sm={6} key={key}>
            <Card
              sx={{
                height: '100%',
                minHeight: 160,
                transition: 'all 0.2s ease',
                border: '1px solid',
                borderColor: 'divider',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  borderColor: 'primary.main',
                },
              }}
            >
              <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography color="text.secondary" variant="body2" fontWeight={600}>
                    {label}
                  </Typography>
                  <Box sx={{ color: 'primary.main', opacity: 0.9 }}>{icon}</Box>
                </Box>
                <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                  {stats ? stats[key] : 0}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, mt: 'auto' }}>
                  {description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
