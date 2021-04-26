import set from 'lodash/set';


function isValidFilename(filename) {
  if (!filename) return false;

  const split = filename.split('.');
  return split.length > 1
    && split[0]
    && ['json', 'js', 'yaml'].includes(split[split.length - 1]);
}


// WARNING: this import function relies on experimental browser features.
async function loadFileInBrowser(e) {
  const files = Array.from(e.target.files);
  const filename = files[0] && files[0].webkitRelativePath
    ? files[0].webkitRelativePath.split('/').shift()
    : 'File.draft';

  const filePromises = files
    .filter((file) => isValidFilename(file.name))
    .map((file) => new Promise((resolve) => {
      const path = file.webkitRelativePath.split('/');
      path.shift();

      const reader = new FileReader();

      reader.onload = (evt) => {
        const fileReader = document.getElementById('fileReader');
        fileReader.value = '';

        resolve({
          path,
          contents: evt.target.result,
        });
      };

      reader.readAsText(file);
    }));

  const results = await Promise.all(filePromises);

  const f = results.reduce((fileObj, file) => {
    set(fileObj, file.path, file.contents);
    return fileObj;
  }, {});

  return {
    filename,
    files: f,
  };
}

export default loadFileInBrowser;
