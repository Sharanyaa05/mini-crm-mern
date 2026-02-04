import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import AppButton from './AppButton';

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = 'Delete?',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
}) {
  const handleConfirm = async () => {
    await onConfirm?.();
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <AppButton variant="outlined" color="secondary" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </AppButton>
        <AppButton
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={loading}
        >
          {confirmLabel}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}
