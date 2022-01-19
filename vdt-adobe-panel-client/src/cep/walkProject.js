/* eslint-disable no-console */
import evalScript from './evalScript';
import { VIDISPINE_ITEM_ID, PROJECT_ITEM_TYPE } from './const';

export const reduceProjectTree = (projectTree) => {
  const projectItemReducer = (acc, projectItem) => {
    if (projectItem.type === PROJECT_ITEM_TYPE.CLIP && !projectItem.isSequence) {
      acc.push(projectItem);
      return acc;
    }
    if (Array.isArray(projectItem.children)) {
      return projectItem.children.reduce(projectItemReducer, acc);
    }
    return acc;
  };
  const projectBinReducer = (acc, projectItem) => {
    if (projectItem.type === PROJECT_ITEM_TYPE.BIN) {
      acc.push(projectItem);
    }
    if (Array.isArray(projectItem.children)) {
      return projectItem.children.reduce(projectBinReducer, acc);
    }
    return acc;
  };
  const projectItems = projectTree.children.reduce(projectItemReducer, []);
  const projectBins = projectTree.children.reduce(projectBinReducer, []);
  return { projectItems, projectBins };
};

const walkProject = async () => {
  const projectTree = await evalScript('$._VIDISPINE_.walkProject')({
    fields: [VIDISPINE_ITEM_ID],
  });
  return projectTree;
};

export default walkProject;
