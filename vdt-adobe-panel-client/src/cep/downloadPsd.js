import { item as ItemApi } from '@vidispine/vdt-api';
import { parseMetadataType } from '@vidispine/vdt-js';
import chooseDirectory from './chooseDirectory';

import { ORIGINAL_TAG } from './const';
import evalScript from './evalScript';
import { path, fs, axios } from './node';

const saveFile = evalScript('$._VIDISPINE_.saveFile');

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
  return {
    [ORIGINAL_TAG]: parseShapeComponent(originalShape),
  };
};

export const downloadFilePsd = async ({ url, filePath }) => {
  const writer = fs.createWriteStream(filePath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

export const downloadItemPsd = async ({ itemId }) => {
  if (itemId === undefined) {
    throw Error('No Item ID');
  }
  const folder = chooseDirectory();
  if (!folder) {
    throw Error('No folder');
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
    [ORIGINAL_TAG]: { uri: originalUrl },
  } = parseShapeList(itemDocument?.shape);
  const filePath = path.join(folder, filename);
  await downloadFilePsd({
    url: originalUrl,
    filePath,
    filename,
    itemId,
  });

  saveFile(filePath);

  return undefined;
};
