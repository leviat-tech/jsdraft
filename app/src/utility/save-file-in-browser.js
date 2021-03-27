import JSZip from 'jszip';
import downloadFile from './download-file.js';


async function saveFileInBrowser(draftFilename, draft) {
  const zip = new JSZip();

  Object.entries(draft.files).forEach(([name, file]) => {
    const filename = `${name}.sketch.${file.filetype}`;
    zip.file(filename, file.contents);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  downloadFile(content, `${draftFilename}.draft.zip`);
}

export default saveFileInBrowser;
