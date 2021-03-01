// const ipcRenderer = require('electron').ipcRenderer;
async function loadFileInElectron() {
  const res = await window.electron.openFile();
  console.log('res', res);
  // return new Promise((resolve) => {
  //   remote.dialog.showOpenDialog({
  //     properties: ['openDirectory'],
  //   }, (files) => {
  //     if (files !== undefined) {
  //       console.log('files', files);
  //     } else {
  //       resolve([]);
  //     }
  //   });
  // });

  return [];
}

export default loadFileInElectron;
