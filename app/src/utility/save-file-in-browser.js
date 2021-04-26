import JSZip from 'jszip';
import downloadFile from './download-file.js';


async function saveFileInBrowser(draftFilename, files) {
  const zip = new JSZip();

  const fileList = [];
  fileList.push(...Object.entries(files).map((file) => ({ file, path: '' })));

  while (fileList.length > 0) {
    const file = fileList.pop();
    if (typeof file.file[1] === 'object') {
      fileList.push(...Object.entries(file.file[1]).map((f) => ({ file: f, path: file.path + file.file[0] })));
    } else {
      const path = file.path
        ? `${file.path}/${file.file[0]}`
        : file.file[0];
      zip.file(path, file.file[1]);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  downloadFile(content, `${draftFilename}.draft.zip`);
}

export default saveFileInBrowser;
