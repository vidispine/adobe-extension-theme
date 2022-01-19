import { EVALSCRIPT_ERRROR_MESSAGE } from './const';

const evalScript = (scriptName) => (...args) =>
  new Promise((resolve, reject) => {
    const scriptOpts = args.map((arg) => JSON.stringify(arg));
    const scriptString = `JSON.stringify(${scriptName}(${scriptOpts.join(', ')}))`;
    if (typeof CSInterface === 'undefined') resolve();
    const csInterface = new CSInterface();
    const callback = (scriptResponse) => {
      if (scriptResponse.startsWith(EVALSCRIPT_ERRROR_MESSAGE)) reject(EVALSCRIPT_ERRROR_MESSAGE);
      try {
        if (scriptResponse === 'undefined') {
          resolve(undefined);
          return;
        }
        const parsedResponse = JSON.parse(scriptResponse);
        resolve(parsedResponse);
      } catch (e) {
        if (e instanceof SyntaxError) {
          resolve(scriptResponse);
        } else {
          throw e;
        }
      }
    };
    csInterface.evalScript(scriptString, callback);
  });

export default evalScript;
