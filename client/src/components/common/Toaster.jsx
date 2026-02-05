import { Snackbar, Box, Typography, IconButton, Slide } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';

const AUTO_HIDE_DURATION = 1000;

function SlideFromRight(props) {
  return <Slide {...props} direction="left" />;
}

const variantConfig = {
  error: {
    icon: ErrorIcon,
    borderColor: 'error.main',
    bgColor: 'error.light',
    iconColor: 'error.main',
  },
  success: {
    icon: CheckCircleIcon,
    borderColor: 'success.main',
    bgColor: 'success.light',
    iconColor: 'success.main',
  },
  warning: {
    icon: WarningIcon,
    borderColor: 'warning.main',
    bgColor: 'warning.light',
    iconColor: 'warning.main',
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
      TransitionProps={{ timeout: 200 }}
      sx={{
        mt: 1.5,
        mr: 1.5,
        '&.MuiSnackbar-root': {
          alignItems: 'flex-start',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2,
          py: 2.25,
          pr: 0.75,
          minWidth: 360,
          maxWidth: 380,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: 'divider',
          borderLeft: '4px solid',
          borderLeftColor: config.borderColor,
          bgcolor: 'background.paper',
          boxShadow: 3,
        }}
      >
        <Icon sx={{ color: config.iconColor, fontSize: 22, flexShrink: 0 }} />
        <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, color: 'text.primary', lineHeight: 1.4 }}>
          {message}
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          aria-label="Close"
          sx={{ color: 'text.secondary', p: 0.5, '&:hover': { bgcolor: 'action.hover' } }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Snackbar>
  );
}
