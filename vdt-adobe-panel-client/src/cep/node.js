/* eslint-disable no-underscore-dangle */
let _path = { join: (...paths) => paths.join('/') };
let _fs;
let _axios;
let _CancelToken;
/* eslint-enable no-underscore-dangle */

// eslint-disable-next-line camelcase
if (window.cep_node) {
  const { __dirname: panelPath } = window;
  _fs = cep_node.require('fs');
  _path = cep_node.require('path');
  const axiosModule = cep_node.require(_path.join(panelPath, 'node_modules/axios/dist/axios.js'));
  _CancelToken = axiosModule.CancelToken;
  const axiosAdapter = cep_node.require(
    _path.join(panelPath, 'node_modules/axios/lib/adapters/http.js'),
  );
  _axios = axiosModule.create({ adapter: axiosAdapter });
}

const path = _path;
const fs = _fs;
const axios = _axios;
const CancelToken = _CancelToken;

export { fs, axios, CancelToken, path };
