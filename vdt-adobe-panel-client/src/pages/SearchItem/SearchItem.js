import React from 'react';
import { withStyles, Box, Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import { ItemList, ItemGrid, LayoutButtonGroup } from '@vidispine/vdt-materialui';

import useSearchItem from './hooks/useSearchItem';
import ItemRow from './ItemRow';
import ItemCard from './ItemCard';
import { SearchBar, Pagination } from '../../components';

const styles = ({ palette, spacing }) => ({
  root: {
    height: '100%',
    '& .MuiToolbar-gutters': {
      padding: 0,
    },
    '& .MuiListItem-container:last-child': {
      borderBottom: `1px solid ${palette.color.gray.scrollbar}`,
    },
    '& .MuiGrid-item': {
      padding: '4px',
      width: '50%',
      maxWidth: '125px',
    },
  },
  Card: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  CardHeader: {
    flexShrink: 0,
    padding: spacing(1),
  },
  CardContent: {
    flexGrow: 1,
    overflow: 'auto',
    touchAction: 'manipulation',
    padding: spacing(0, 1, 1, 1),
  },
  CardActions: {
    flexShrink: 0,
    padding: spacing(0, 1, 0, 1),
  },
  List: {
    paddingTop: 0,
    color: palette.color.gray.dark,
  },
  ItemList: {
    backgroundColor: palette.color.gray.light,
    color: 'red',
  },
  SearchInput: {
    height: 'auto',
    color: palette.color.gray.dark,
    fontSize: '.7rem',
  },
  Pagination: {
    backgroundColor: palette.color.gray.strong,
  },
});

function SearchItem({ classes }) {
  const [layout, setLayout] = React.useState('ROW_VIEW');
  const toggleLayout = (_, payload) => payload && setLayout(payload);

  const {
    page,
    rowsPerPage,
    itemListType,
    onChangePage,
    setSearchText,
    onChangeRowsPerPage,
  } = useSearchItem();

  const { hits: count = 0 } = itemListType;

  return (
    <div className={classes.root}>
      <Card className={classes.Card} variant="outlined">
        <CardHeader
          className={classes.CardHeader}
          disableTypography
          subheader={
            <Box display="flex" alignItems="center">
              <SearchBar className={classes.SearchInput} onSubmit={setSearchText} />
              <Box ml={1} height={32}>
                <LayoutButtonGroup viewLayout={layout} onChangeViewLayout={toggleLayout} />
              </Box>
            </Box>
          }
        />
        <CardContent className={classes.CardContent}>
          {
            {
              ROW_VIEW: (
                <ItemList
                  className={classes.List}
                  itemListType={itemListType}
                  ItemListItemComponent={ItemRow}
                />
              ),
              GRID_VIEW: (
                <ItemGrid
                  itemListType={itemListType}
                  ItemCardProps={{ MediaCardComponent: ItemCard }}
                  GridContainerProps={{ spacing: 1 }}
                />
              ),
            }[layout]
          }
        </CardContent>
        <CardActions className={classes.CardActions}>
          <Pagination
            page={page}
            count={count}
            rowsPerPage={rowsPerPage}
            onChangePage={onChangePage}
            onChangeRowsPerPage={onChangeRowsPerPage}
          />
        </CardActions>
      </Card>
    </div>
  );
}

export default withStyles(styles)(SearchItem);
