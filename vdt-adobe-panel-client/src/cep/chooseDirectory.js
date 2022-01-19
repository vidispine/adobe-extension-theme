import showOpenDialog from './showOpenDialog';
import { DOWNLOAD_FOLDER_KEY } from './const';

const chooseDirectory = (reset = false) => {
  let directory = JSON.parse(localStorage.getItem(DOWNLOAD_FOLDER_KEY));
  if (reset === false && directory && cep.fs.readdir(directory).err === 0) return directory;
  const { data = [] } = showOpenDialog({ chooseDirectory: true, title: 'Set Download Path' });
  const [fullPath] = data;
  if (fullPath) {
    directory = decodeURI(fullPath);
    if (directory.startsWith('file://')) {
      directory = directory.replace('file://', '');
    }
  }
  localStorage.setItem(DOWNLOAD_FOLDER_KEY, JSON.stringify(directory));
  return directory;
};

export default chooseDirectory;
