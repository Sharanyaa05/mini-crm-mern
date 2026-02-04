import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
} from '@mui/material';

export default function DataTable({
  columns = [],
  rows = [],
  loading = false,
  loadingComponent,
  total = 0,
  page = 1,
  rowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  renderRow,
  emptyMessage = 'No data',
  sx = {},
}) {
  return (
    <Paper sx={{ overflow: 'hidden', ...sx }}>
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    fontWeight: 600,
                    bgcolor: 'background.paper',
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                  {loadingComponent}
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (renderRow ? renderRow(row, idx) : null))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {total > 0 && onPageChange && (
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          onPageChange={(_, p) => onPageChange(p + 1)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
          sx={{ borderTop: 1, borderColor: 'divider' }}
        />
      )}
    </Paper>
  );
}
