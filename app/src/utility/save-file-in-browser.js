import JSZip from 'jszip';
import downloadFile from './download-file.js';


async function saveFileInBrowser(draftFilename, draft) {
  const zip = new JSZip();

  Object.entries(draft.sketches).forEach(([name, sketch]) => {
    const filename = `${name}.sketch.${sketch.filetype}`;
    zip.file(filename, sketch.contents);
  });

  const content = await zip.generateAsync({ type: 'blob' });
  downloadFile(content, `${draftFilename}.draft.zip`);
}

export default saveFileInBrowser;
