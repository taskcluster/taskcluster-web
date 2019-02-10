const fs = require('fs');
const md = require('md-directory');
const readDirectory = require('read-directory');
const { join } = require('path');
const removeExtension = require('../utils/removeExtension');

const FILES_TO_IGNORE = ['.gitignore'];
const generatedDocsPath = join(__dirname, '..', '..', 'generated', 'docs');
const projectMetadata = {};

function getProjectMetadata(projectName) {
  if (!projectMetadata[projectName]) {
    projectMetadata[projectName] = JSON.parse(
      fs.readFileSync(join(generatedDocsPath, projectName, 'metadata.json'))
    );
  }

  return projectMetadata[projectName];
}

// Sort files by the order property
function sort(a, b) {
  const first = a.data.order;
  const second = b.data.order;

  if (typeof first !== 'number') {
    return 1;
  }

  if (typeof second !== 'number') {
    return -1;
  }

  return first - second;
}

function sortChildren(children) {
  // recursively sort child nodes
  if (children && children.length) {
    children.map(child => sortChildren(child.children));
  }

  children.sort(sort);
}

const referenceDocs = fs
  .readdirSync(generatedDocsPath)
  .reduce((acc, projectName) => {
    if (FILES_TO_IGNORE.includes(projectName)) {
      return acc;
    }

    // Dig inside the micro-service markdown files
    // We use md.parseDirSync instead of readDirectory in order
    // to collect the front matter of the markdown file
    const mdFiles = md.parseDirSync(join(generatedDocsPath, projectName), {
      dirnames: true,
    });
    const referenceFiles = readDirectory.sync(
      join(generatedDocsPath, projectName),
      {
        filter: 'references/*.json',
        transform: content => ({
          content: JSON.parse(content),
          data: { inline: true },
        }),
      }
    );
    const metadata = getProjectMetadata(projectName);
    const allFiles = { ...mdFiles, ...referenceFiles };

    // Rename key
    Object.keys(allFiles).forEach(oldKey => {
      const path = `reference/${metadata.tier}/${projectName}/${oldKey}`;

      delete Object.assign(allFiles, {
        [removeExtension(path)]: Object.assign(allFiles[oldKey]),
      })[oldKey];
    });

    return Object.assign(acc, allFiles);
  }, {});
// raw + static docs
const files = Object.assign(
  md.parseDirSync('./src/docs', { dirnames: true }),
  referenceDocs
);
// Traverse the nodes in order, setting `up`, `next`, and
// `prev` links.
let prevNode = null;

/* eslint-disable no-param-reassign */
function addNav(node, parentNode) {
  if (parentNode && parentNode.path) {
    node.up = {
      path: parentNode.path,
      title: (parentNode.data && parentNode.data.title) || parentNode.name,
    };
  }

  if (prevNode && prevNode.path) {
    node.prev = {
      path: prevNode.path,
      title: (prevNode.data && prevNode.data.title) || prevNode.name,
    };

    prevNode.next = {
      path: node.path,
      title: (node.data && node.data.title) || node.name,
    };
  }

  prevNode = node;
  parentNode = node;

  node.children.forEach(child => addNav(child, parentNode));
}
/* eslint-enable no-param-reassign */

const makeToc = rootPath => {
  const nodes = { children: [] };

  Object.keys(files)
    .filter(path => path.startsWith(rootPath))
    .map(path => ({ path, data: files[path].data }))
    .forEach(item => {
      let ptr = nodes;
      const path = [];

      item.path
        .replace(rootPath, '')
        .split('/')
        .forEach((name, idx) => {
          path.push(name);

          // for reference docs, ignore 'references' and 'docs'
          // at the 3th position in the filename; these are just
          // left out of the hierarchy as in
          // `mv reference/taskcluster-foo/docs/* reference/taskcluster/foo`
          if (
            rootPath === 'reference/' &&
            idx === 2 &&
            (name === 'references' || name === 'docs')
          ) {
            return;
          }

          let child = ptr.children.find(child => child.name === name);

          if (!child) {
            child = {
              name,
              children: [],
              data: Object.assign(item.data, {
                order: name === 'index' ? 0 : item.data.order || 1000,
              }),
              path: `${rootPath}${path.join('/')}`,
            };

            if (name === 'index') {
              ptr.data = child.data;
            } else {
              if (rootPath === 'reference/' && name === 'README') {
                ptr.data = child.data;
                ptr.path = `${rootPath}${path.join('/')}`;
              }

              ptr.children.push(child);
            }
          }

          ptr = child;
        });
    });

  sortChildren(nodes.children);
  addNav(nodes, null);

  return nodes;
};

const [gettingStarted, resources] = ['index', 'resources'].map(fileName =>
  Object.assign(files[fileName], {
    name: fileName,
    path: fileName,
    children: [],
    content: undefined,
    data: Object.assign(files[fileName].data, {
      order: files[fileName].data.order || 0,
    }),
  })
);
const docsTableOfContents = {
  gettingStarted,
  manual: makeToc('manual/'),
  reference: makeToc('reference/'),
  tutorial: makeToc('tutorial/'),
  resources,
};

fs.writeFile(
  './src/autogenerated/docsTableOfContents.json',
  `${JSON.stringify(docsTableOfContents)}\n`,
  err => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error('Error writing docsTableOfContents file', err);
    } else {
      // eslint-disable-next-line no-console
      console.log('Documentation table of contents successfully extracted!');
    }
  }
);
