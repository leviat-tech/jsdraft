const { dialog } = require('electron');


console.log('dialog', dialog);


async function openFileDialog() {
  return new Promise((resolve) => {
    dialog.showOpenDialog({
      properties: ['openFile'],
    }, (files) => {
      if (files !== undefined) {
        console.log(files);
        // handle files
        resolve([]);
      } else {
        resolve([]);
      }
    });
  });
}

module.exports = openFileDialog;
