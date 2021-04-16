import JSZip from 'jszip';
import downloadFile from './download-file.js';


async function saveFileInBrowser(draftFilename, draft) {
  const zip = new JSZip();

  Object.entries(draft.files).forEach(([name, file]) => {
    const filename = `${name}.sketch.${file.extension}`;
    zip.file(filename, file.contents);
  });

  // Adding a blank index file allows for simplified importing
  zip.file('index.js', '');

  const content = await zip.generateAsync({ type: 'blob' });
  downloadFile(content, `${draftFilename}.draft.zip`);
}

export default saveFileInBrowser;
