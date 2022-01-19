import React from 'react';
import { Box, TablePagination, IconButton, withStyles } from '@material-ui/core';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@material-ui/icons';

const styles = (theme) => ({
  root: {
    '& .MuiTablePagination-selectRoot': { marginLeft: 0, marginRight: theme.spacing(1) },
    '& .MuiTablePagination-toolbar': { minHeight: `42px` },
    '& .MuiSelect-icon': {
      top: `calc(50% - 10px)`,
    },
  },
});

const SearchPaginationActions = ({ count, page, rowsPerPage, onPageChange }) => {
  return (
    <Box ml={1} display="flex">
      <IconButton size="small" onClick={() => onPageChange({ page: 0 })} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => onPageChange({ page: page - 1 })}
        disabled={page === 0}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => onPageChange({ page: page + 1 })}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        size="small"
        onClick={() => onPageChange({ page: Math.max(0, Math.ceil(count / rowsPerPage) - 1) })}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
};

function SearchPagination({
  classes,
  count = 0,
  page = 0,
  rowsPerPage = 10,
  rowsPerPageOptions: initialRowsPerPageOptions = [10, 25, 50, 100],
  onChangePage,
  onChangeRowsPerPage,
  ActionsComponent = SearchPaginationActions,
  TablePaginationProps = {},
}) {
  const rowsPerPageOptions = !initialRowsPerPageOptions.includes(rowsPerPage)
    ? [...initialRowsPerPageOptions, rowsPerPage].sort((a, b) => a - b)
    : initialRowsPerPageOptions;
  return (
    <TablePagination
      className={classes.root}
      size="small"
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onChangePage}
      onRowsPerPageChange={onChangeRowsPerPage}
      ActionsComponent={ActionsComponent}
      rowsPerPageOptions={rowsPerPageOptions}
      labelRowsPerPage=""
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...TablePaginationProps}
    />
  );
}

export default withStyles(styles)(SearchPagination);
