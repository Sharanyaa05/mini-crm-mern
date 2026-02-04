import { Snackbar, Box, Typography, IconButton, Slide } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

const AUTO_HIDE_DURATION = 3000;

function SlideFromRight(props) {
  return <Slide {...props} direction="left" />;
}

const variantConfig = {
  error: {
    icon: ErrorIcon,
    borderColor: '#d32f2f',
    bgColor: '#ffebee',
    iconColor: '#d32f2f',
  },
  success: {
    icon: CheckCircleIcon,
    borderColor: '#2e7d32',
    bgColor: '#e8f5e9',
    iconColor: '#2e7d32',
  },
  warning: {
    icon: WarningIcon,
    borderColor: '#ed6c02',
    bgColor: '#fff3e0',
    iconColor: '#ed6c02',
  },
};

export default function Toaster({ open, message, variant = 'success', onClose }) {
  const config = variantConfig[variant] || variantConfig.success;
  const Icon = config.icon;

  return (
    <Snackbar
      open={open}
      autoHideDuration={AUTO_HIDE_DURATION}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionComponent={SlideFromRight}
      TransitionProps={{ timeout: 300 }}
      sx={{
        mt: 2,
        mr: 2,
        '&.MuiSnackbar-root': {
          alignItems: 'flex-start',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2,
          py: 1.5,
          pr: 0.5,
          minWidth: 280,
          borderRadius: 2,
          border: '2px solid',
          borderColor: config.borderColor,
          bgcolor: config.bgColor,
          boxShadow: 2,
        }}
      >
        <Icon sx={{ color: config.iconColor, fontSize: 28, flexShrink: 0 }} />
        <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: 'text.primary' }}>
          {message}
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close"
          sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    </Snackbar>
  );
}
