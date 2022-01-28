import { useSearch, useSearchItem as useItem } from '@vidispine/vdt-react';
import { PROJECT_APP_TYPE, PHXS } from '../../../const';

const photoshopItemState = {
  itemSearchDocument: {
    filter: [
      {
        name: 'mediaType',
        field: [{ name: 'mediaType', value: [{ value: 'image' }] }],
        operation: 'OR',
      },
    ],
    intervals: 'generic',
  },
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
  const hostEnvironment = localStorage.getItem(PROJECT_APP_TYPE);
  const query = hostEnvironment === PHXS ? photoshopItemState : defaultItemState;

  const { state, ...operations } = useSearch({ ...query, ...config });
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
