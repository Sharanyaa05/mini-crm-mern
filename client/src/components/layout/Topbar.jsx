import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { logout } from '../../store/auth/authSlice';
import { DRAWER_WIDTH } from '../../utils/constants';

export default function Topbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      color="default"
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'primary.main',
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600, color: 'primary.main' }}>
          Mini CRM
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="body2" color="text.secondary">
            {user?.name || user?.email}
          </Typography>
          <Button
            color="primary"
            onClick={handleLogout}
            startIcon={<LogoutIcon fontSize="small" />}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
