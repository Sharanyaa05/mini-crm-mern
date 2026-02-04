import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
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
    <Paper sx={{ overflow: 'hidden', borderRadius: 2, border: '1px solid', borderColor: 'divider', ...sx }}>
      <TableContainer sx={{ minHeight: 320 }}>
        <Table size="small" stickyHeader sx={{ width: '100%', tableLayout: 'fixed', '& tbody td': { py: 1.5, px: 2 } }}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    bgcolor: 'action.hover',
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                    py: 1.5,
                    px: 2,
                    color: 'text.primary',
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
                <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                  {loadingComponent}
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow sx={{ '& td': { borderBottom: 'none', width: '100%' } }}>
                <TableCell
                  colSpan={columns.length}
                  sx={{
                    width: '100%',
                    minHeight: 280,
                    height: 280,
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                  }}
                >
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
          sx={{ borderTop: 1, borderColor: 'divider', minHeight: 52 }}
        />
      )}
    </Paper>
  );
}
