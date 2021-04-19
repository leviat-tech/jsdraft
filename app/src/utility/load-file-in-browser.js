import parseFilename from './parse-filename.js';


// WARNING: this import function relies on experimental browser features.

async function loadFileInBrowser(e) {
  const files = Array.from(e.target.files);
  const filename = files[0] && files[0].webkitRelativePath
    ? files[0].webkitRelativePath.split('/').shift()
    : 'File.draft';

  const filePromises = files
    .map((file) => ({
      name: parseFilename(file.name),
      file,
    }))
    .filter((file) => file.name)
    .map((file) => new Promise((resolve) => {
      const path = file.file.webkitRelativePath.split('/');
      path.shift();

      const reader = new FileReader();

      reader.onload = (evt) => {
        const fileReader = document.getElementById('fileReader');
        fileReader.value = '';

        resolve({
          ...file.name,
          path,
          contents: evt.target.result,
        });
      };

      reader.readAsText(file.file);
    }));

  const results = await Promise.all(filePromises);

  const sketchFeatures = results.some((file) => file.path[0] === 'sketch-features')
    ? results.filter((file) => file.path[0] === 'sketch-features')
    : results;

  const index = results.find((file) => file.path.length === 1 && file.filename === 'index.json');

  return {
    sketch: sketchFeatures,
    index,
    filename,
  };
}

export default loadFileInBrowser;
