import { useSearch, useSearchItem as useItem } from '@vidispine/vdt-react';

const defaultItemState = {
  itemSearchDocument: {},
  queryParams: {
    'noauth-url': true,
    p: [
      'id',
      'shape[tag=original].containerComponent.file.size',
      'metadata.timespan[start=-INF].field[name=title]',
      'metadata.timespan[start=-INF].field[name=itemId]',
      'metadata.timespan[start=-INF].field[name=created]',
      'metadata.timespan[start=-INF].field[name=durationSeconds]',
      'metadata.timespan[start=-INF].field[name=representativeThumbnail]',
      'thumbnails',
    ],
  },
};

const useSearchItem = (config = {}) => {
  const { state, ...operations } = useSearch({ ...defaultItemState, ...config });
  const { matrixParams, queryParams, itemSearchDocument, ...data } = state;
  const { itemListType, isLoading, onRefresh } = useItem({
    itemSearchDocument,
    queryParams,
    matrixParams,
  });
  return {
    ...operations,
    ...data,
    onRefresh,
    itemListType,
    isLoading,
  };
};

export default useSearchItem;
