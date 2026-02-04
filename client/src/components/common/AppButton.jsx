import { Button } from '@mui/material';

export default function AppButton({ children, variant = 'contained', startIcon, endIcon, ...props }) {
  return (
    <Button variant={variant} startIcon={startIcon} endIcon={endIcon} {...props}>
      {children}
    </Button>
  );
}
