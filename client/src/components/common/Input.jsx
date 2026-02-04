import { useState } from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

export default function Input({
  type = 'text',
  showPasswordToggle = false,
  showMatchIndicator = false,
  isMatch = false,
  error,
  helperText,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle && type === 'password'
    ? (showPassword ? 'text' : 'password')
    : type;

  const endAdornment =
    showPasswordToggle && type === 'password' ? (
      <InputAdornment position="end">
        <IconButton
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword((p) => !p)}
          edge="end"
          size="small"
        >
          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
        </IconButton>
      </InputAdornment>
    ) : showMatchIndicator ? (
      <InputAdornment position="end">
        {isMatch ? (
          <CheckCircleIcon color="success" fontSize="small" />
        ) : error ? (
          <ErrorIcon color="error" fontSize="small" />
        ) : null}
      </InputAdornment>
    ) : undefined;

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        type={inputType}
        error={!!error}
        helperText={helperText}
        InputProps={{ endAdornment }}
        {...props}
      />
    </Box>
  );
}
