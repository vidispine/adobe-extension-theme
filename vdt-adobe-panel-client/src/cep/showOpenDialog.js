const showOpenDialog = ({
  allowMultipleSelection,
  chooseDirectory,
  title,
  initialPath,
  fileTypes,
}) => cep.fs.showOpenDialog(allowMultipleSelection, chooseDirectory, title, initialPath, fileTypes);

export default showOpenDialog;
