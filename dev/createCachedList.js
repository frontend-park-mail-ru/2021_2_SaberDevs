const fs = require('fs');
const path = require('path');

const correctLaunchDir = '2021_2_SaberDevs';
const cachedFilesRoot = 'public';
const SWJSFile = 'serviceWorker.js';

console.log(
    `[START] ===============================
    \t=  Скрипт заполнение списка   =
    \t=      кешируемых файлов      =
    \t=      Команды SaberDevs      =
    \t===============================`,
);

const currentDir = path.basename(path.resolve('.'));
if (currentDir !== correctLaunchDir) {
  console.log(`\tВы запустили меня из ${currentDir}/
      \tНо я очень нежный код
      \tПожалуйста, запустите меня
      \tиз ${correctLaunchDir}/
      \t===============================`,
  );
}

const files = ['/'];
const walk = require('walk');

// Walker options
const walker = walk.walk('./' + cachedFilesRoot, {followLinks: false});

walker.on('file', (root, stat, next) => {
  // Add this file to the list of files
  const path = root + '/' + stat.name;
  files.push(path.replace(/\\/g, '/').replace('public/', ''));
  next();
});

walker.on('end', () => {
  files.splice(files.indexOf('./' + cachedFilesRoot + '/' + SWJSFile), 1);
  fs.readFile('./' + cachedFilesRoot + '/' + SWJSFile, 'utf8', (err, data) => {
    if (err) {
      return console.log(err);
    }
    const result = data.replace(
        /cacheUrls = \[(.*?)\];/gs,
        `cacheUrls = ${
          JSON.stringify(files)
              .replace(/"(.*?)"/g, '  \'$1\'')
              .replace('[', '[\n')
              .replace(/,/g, ',\n')
              .replace(/]/, ',\n];')}`,
    );
    fs.writeFileSync(
        './' + cachedFilesRoot + '/' + SWJSFile,
        result,
        'utf8',
    );
    console.log(
        `[DONE]  ${files.length} caching filepaths writen to
${'./' + cachedFilesRoot + '/' + SWJSFile}\n`,
    );
  });
});
