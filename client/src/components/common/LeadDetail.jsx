import { Box, Typography, Paper, Divider } from '@mui/material';

function DetailRow({ label, value }) {
  return (
    <Box sx={{ py: 1.5 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body1">{value || '—'}</Typography>
    </Box>
  );
}

export default function LeadDetail({ lead }) {
  if (!lead) return null;

  return (
    <Box sx={{ width: '100%', maxWidth: 480 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          Lead Details
        </Typography>
        <DetailRow label="Name" value={lead.name} />
        <Divider sx={{ my: 0.5 }} />
        <DetailRow label="Email" value={lead.email} />
        <Divider sx={{ my: 0.5 }} />
        <DetailRow label="Phone" value={lead.phone} />
        <Divider sx={{ my: 0.5 }} />
        <DetailRow label="Status" value={lead.status} />
        <Divider sx={{ my: 0.5 }} />
        <DetailRow label="Assigned To" value={lead.assignedTo?.name} />
        <Divider sx={{ my: 0.5 }} />
        <DetailRow label="Company" value={lead.company?.name} />
      </Paper>
    </Box>
  );
}
