import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { DRAWER_WIDTH } from '../../utils/constants';

const navItems = [
  { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
  { label: 'Leads', path: '/leads', icon: <PeopleIcon /> },
  { label: 'Companies', path: '/companies', icon: <BusinessIcon /> },
  { label: 'Tasks', path: '/tasks', icon: <AssignmentIcon /> },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <List sx={{ width: DRAWER_WIDTH, pt: 2 }}>
      {navItems.map((item) => {
        const selected = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
        return (
          <ListItemButton
            key={item.path}
            selected={selected}
            onClick={() => navigate(item.path)}
            sx={{
              mx: 1,
              borderRadius: 2,
              mb: 0.5,
              color: selected ? 'primary.main' : 'text.secondary',
              '&.Mui-selected': {
                bgcolor: 'action.hover',
                color: 'primary.main',
                '&:hover': { bgcolor: 'action.hover' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: selected ? 600 : 400 }} />
          </ListItemButton>
        );
      })}
    </List>
  );
}
