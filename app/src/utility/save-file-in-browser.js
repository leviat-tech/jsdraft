import JSZip from 'jszip';
import downloadFile from './download-file.js';


async function saveFileInBrowser(draftFilename, draft) {
  const zip = new JSZip();

  Object.entries(draft.features.sketch).forEach(([name, file]) => {
    const filename = `sketch-features/${name}.${file.extension}`;
    zip.file(filename, file.contents);
  });

  zip.file('index.json', JSON.stringify(draft.meta, null, 2));

  const content = await zip.generateAsync({ type: 'blob' });
  downloadFile(content, `${draftFilename}.draft.zip`);
}

export default saveFileInBrowser;
