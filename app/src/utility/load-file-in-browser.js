import parseFilename from './parse-filename.js';


async function loadFileInBrowser(e) {
  const files = Array.from(e.target.files);

  const filePromises = files
    .map((file) => ({
      name: parseFilename(file.name),
      file,
    }))
    .filter((file) => file.name)
    .map((file) => new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (evt) => {
        const fileReader = document.getElementById('fileReader');
        fileReader.value = '';

        resolve({
          ...file.name,
          contents: evt.target.result,
        });
      };

      reader.readAsText(file.file);
    }));

  const results = await Promise.all(filePromises);
  return results;
}

export default loadFileInBrowser;
