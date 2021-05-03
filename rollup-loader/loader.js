import fs from 'fs';
import path from 'path';
import set from 'lodash/set';
import toSource from 'tosource';


function isFile(p) {
  const stat = fs.lstatSync(p);
  return stat.isFile();
}

function isValidFilename(filename) {
  if (!filename) return false;

  const split = filename.split('.');
  return split.length > 1
    && split[0]
    && ['json', 'js', 'yaml'].includes(split[split.length - 1]);
}

function filePromises(files, root, dir = '') {
  return files
    .filter((file) => isFile(path.join(root, dir, file)))
    .filter((file) => isValidFilename(file))
    .map(async (file) => ({
      path: dir ? `${dir}/${file}` : file,
      contents: await fs.promises.readFile(path.join(root, dir, file), 'utf-8'),
    }));
}

async function getFile(p) {
  const rootFiles = await fs.promises.readdir(p);
  const sketchFeatures = await (fs.existsSync(path.join(p, 'sketch-features'))
    ? fs.promises.readdir(path.join(p, 'sketch-features'))
    : []);

  const f = await Promise.all([
    ...filePromises(rootFiles, p),
    ...filePromises(sketchFeatures, p, 'sketch-features'),
  ]);

  const files = f.reduce((obj, file) => {
    const p = file.path.split('/');
    set(obj, p, file.contents);
    return obj;
  }, {});

  return files;
}

export default function loader() {
  const ext = /\.draft$/;

  return {
    name: '@crhio/vite-plugin-jsdraft',

    resolveId(source, importer) {
      if (ext.test(source)) {
        const p = path.resolve(path.dirname(importer), source);
        return p;
      }

      return null;
    },

    load(id) {
      if (ext.test(id)) return id;

      return null;
    },

    async transform(content, id) {
      if (ext.test(id)) {
        const files = await getFile(content);

        const code = `
          import { Draft } from '@crhio/jsdraft';

          const files = ${toSource(files)};

          const draft = Draft.load(files);

          export default draft;
        `;

        return {
          code,
          map: { mappings: '' },
        };
      }

      return null;
    },
  };
}
