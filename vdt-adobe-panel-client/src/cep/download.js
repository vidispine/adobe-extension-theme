import { item as ItemApi } from '@vidispine/vdt-api';
import { parseMetadataType } from '@vidispine/vdt-js';
import debounce from 'lodash.debounce';

import {
  ORIGINAL_TAG,
  PROXY_TAG,
  DOWNLOAD_START,
  DOWNLOAD_PROGRESS,
  DOWNLOAD_FINISH,
  DOWNLOAD_ERROR,
  VIDISPINE_ITEM_ID,
} from './const';
import { CancelToken, fs, axios, path } from './node';
import chooseDirectory from './chooseDirectory';
import evalScript from './evalScript';
import walkProject, { reduceProjectTree } from './walkProject';

const importFile = evalScript('$._VIDISPINE_.importFile');
const importProxy = evalScript('$._VIDISPINE_.importProxy');
const attachProxy = evalScript('$._VIDISPINE_.attachProxy');
const attachOriginal = evalScript('$._VIDISPINE_.attachOriginal');

const parseShapeComponent = (shape = {}) => {
  const shapeComponent =
    shape?.containerComponent ||
    shape?.binaryComponent?.[0] ||
    shape?.videoComponent?.[0] ||
    shape?.audioComponent?.[0] ||
    shape?.subtitleComponent?.[0] ||
    shape?.descriptorComponent?.[0];
  const isMedia = Boolean(shape?.videoComponent?.[0]) || Boolean(shape?.audioComponent?.[0]);
  const uri = shapeComponent?.file?.[0]?.uri?.[0];
  const size = shapeComponent?.file?.[0]?.size;
  const canDownload = uri && size > 0 && isMedia;
  return {
    uri,
    size,
    canDownload,
  };
};

const parseShapeList = (shapeList = []) => {
  const originalShape = shapeList.find(({ tag }) => tag.includes(ORIGINAL_TAG));
  const proxyShape = shapeList.find(({ tag }) => tag.includes(PROXY_TAG));
  return {
    [ORIGINAL_TAG]: parseShapeComponent(originalShape),
    [PROXY_TAG]: parseShapeComponent(proxyShape),
  };
};

const fileExtensionFromUrl = (urlString) => {
  const url = new URL(urlString);
  const { pathname } = url;
  const fileName = pathname.split('/').pop();
  const [, extension] = fileName.split('.');
  return extension;
};

const isProjectItemOffline = ({ tagList, projectItem }) => {
  let offlineOriginal = tagList.includes(ORIGINAL_TAG);
  let offlineProxy = tagList.includes(PROXY_TAG);
  if (projectItem) {
    const { hasProxy, isOffline, canProxy } = projectItem;
    if (offlineOriginal && isOffline === false) offlineOriginal = false;
    if (
      tagList.includes(ORIGINAL_TAG) &&
      projectItem.mediaPath === projectItem.proxyPath &&
      hasProxy === true
    )
      offlineOriginal = true;
    if (offlineProxy && hasProxy === true) offlineProxy = false;
    if (offlineProxy && canProxy === false) offlineProxy = false;
  }
  return [offlineOriginal, offlineProxy];
};

export const downloadFile = async ({
  url,
  filePath,
  fileSizeBytes,
  onDownloadProgress,
  onDownloadProgressProps = {},
  ...props
}) => {
  let progressBytes = 0;
  let progressPercent = 0;
  const source = CancelToken.source();
  const startTimestamp = Date.now();

  const onDownloadProgressHelper = ({ actionType, error, cancelSource } = {}) => ({
    ...onDownloadProgressProps,
    ...props,
    actionType,
    progressPercent,
    progressBytes,
    fileSizeBytes,
    startTimestamp,
    ...(cancelSource && { cancel: source.cancel }),
    lastTimestamp: Date.now(),
    ...(error && { errorMessage: error.message, error }),
  });

  try {
    const writer = fs.createWriteStream(filePath);
    if (onDownloadProgress) {
      onDownloadProgress(
        onDownloadProgressHelper({
          actionType: DOWNLOAD_START,
          onDownloadProgressProps,
          props,
          cancelSource: source,
        }),
      );
    }
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      onDownloadProgress,
      cancelToken: source.token,
    });
    response.data.pipe(writer);
    if (onDownloadProgress) {
      response.data.on('data', (data) => {
        progressBytes += data.length;
        progressPercent = (progressBytes / fileSizeBytes) * 100;
        onDownloadProgress(
          onDownloadProgressHelper({
            actionType: DOWNLOAD_PROGRESS,
            onDownloadProgressProps,
            props,
            cancelSource: source,
          }),
        );
      });
      writer.on('finish', () =>
        onDownloadProgress(
          onDownloadProgressHelper({
            actionType: DOWNLOAD_FINISH,
            onDownloadProgressProps,
            props,
          }),
        ),
      );
      writer.on('error', (error) =>
        onDownloadProgress(
          onDownloadProgressHelper({
            actionType: DOWNLOAD_ERROR,
            error,
            onDownloadProgressProps,
            props,
          }),
        ),
      );
    }
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (error) {
    if (onDownloadProgress)
      onDownloadProgress(
        onDownloadProgressHelper({
          actionType: DOWNLOAD_ERROR,
          error,
          onDownloadProgressProps,
          props,
        }),
      );
    throw error;
  }
};

export const downloadItem = async ({
  itemId,
  onDownloadProgress,
  onDownloadProgressProps,
  tag = [ORIGINAL_TAG],
  nodeId,
  ...props
}) => {
  if (itemId === undefined) {
    throw Error('No Item ID');
  }
  if (!Array.isArray(tag) || tag.length === 0) {
    throw Error('No Tags');
  }
  const folder = props.folder || chooseDirectory();
  if (!folder) {
    throw Error('No folder');
  }
  const projectTree = await walkProject();
  if (!Array.isArray(projectTree.children)) {
    return [];
  }
  const { projectItems } = reduceProjectTree(projectTree);
  let projectItem = projectItems.find(
    (thisProjectItem) => thisProjectItem?.metadata?.[VIDISPINE_ITEM_ID] === itemId,
  );
  const [offlineOriginal, offlineProxy] = isProjectItemOffline({ tagList: tag, projectItem });
  if (offlineOriginal === false && offlineProxy === false) {
    return Promise.resolve(projectItem);
  }
  const queryParams = {
    p: [
      'shape.[tag,containerComponent,videoComponent,audioComponent,binaryComponent,subtitleComponent,descriptorComponent].file.[uri,size]',
      'metadata.timespan[start=-INF][end=+INF].field[name=originalFilename].value.value',
      'metadata.timespan[start=-INF][end=+INF].field[name=mediaType].value.value',
    ].map((p) => encodeURIComponent(p)),
    methodMetadata: [{ key: 'format', value: 'SIGNED-AUTO' }],
    'noauth-url': true,
  };
  const { data: itemDocument } = await ItemApi.getItem({ itemId, queryParams });
  const { originalFilename: filename } = parseMetadataType(itemDocument?.metadata, {
    flat: true,
    arrayOnSingle: false,
  });
  if (filename === undefined) {
    throw Error('No File Name');
  }
  const {
    [ORIGINAL_TAG]: {
      uri: originalUrl,
      size: originalFileSizeBytes,
      canDownload: canDownloadOriginal,
    },
    [PROXY_TAG]: { uri: proxyUrl, size: proxyFileSizeBytes, canDownload: canDownloadProxy },
  } = parseShapeList(itemDocument?.shape);
  if (offlineProxy && canDownloadProxy) {
    if (proxyFileSizeBytes === undefined || proxyFileSizeBytes === 0) {
      throw Error('No Proxy File Size');
    }
    const fileExtension = fileExtensionFromUrl(proxyUrl);
    const proxyFilename = [filename, PROXY_TAG, fileExtension].join('.');
    const filePath = path.join(folder, proxyFilename);
    try {
      await fs.promises.access(filePath);
      onDownloadProgress({
        ...onDownloadProgressProps,
        actionType: DOWNLOAD_FINISH,
        progressPercent: 100,
        progressBytes: proxyFileSizeBytes,
        fileSizeBytes: proxyFileSizeBytes,
        title: proxyFilename,
        filename: proxyFilename,
        itemId,
      });
    } catch {
      await downloadFile({
        url: proxyUrl,
        filePath,
        onDownloadProgress: debounce(onDownloadProgress, 500),
        onDownloadProgressProps,
        fileSizeBytes: proxyFileSizeBytes,
        title: proxyFilename,
        filename: proxyFilename,
        itemId,
      });
    }
    if (projectItem) {
      projectItem = await attachProxy(filePath, projectItem.mediaPath);
    } else {
      projectItem = await importProxy(filePath, { [VIDISPINE_ITEM_ID]: itemId }, filename);
    }
  }
  if (offlineOriginal && canDownloadOriginal) {
    if (originalUrl === undefined) throw Error('No Original Download URL');
    if (originalFileSizeBytes === undefined || originalFileSizeBytes === 0) {
      throw Error('No Original File Size');
    }
    const filePath = path.join(folder, filename);
    try {
      await fs.promises.access(filePath);
      onDownloadProgress({
        ...onDownloadProgressProps,
        actionType: DOWNLOAD_FINISH,
        progressPercent: 100,
        progressBytes: originalFileSizeBytes,
        fileSizeBytes: originalFileSizeBytes,
        title: filename,
        filename,
        itemId,
      });
    } catch {
      await downloadFile({
        url: originalUrl,
        filePath,
        onDownloadProgress: debounce(onDownloadProgress, 500),
        onDownloadProgressProps,
        fileSizeBytes: originalFileSizeBytes,
        filename,
        itemId,
      });
    }
    if (projectItem) {
      projectItem = await attachOriginal(filePath, projectItem.mediaPath);
      return projectItem;
    }
    projectItem = await importFile(filePath, { [VIDISPINE_ITEM_ID]: itemId });
    return projectItem;
  }
  return undefined;
};
