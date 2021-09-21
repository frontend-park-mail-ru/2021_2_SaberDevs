const fs = require('fs');
const path = require('path');
const pug = require('pug');

const correctLaunchDir = '2021_2_SaberDevs';
const devRoot = 'dev/';
const templatesDir = 'components/';
const outDir = 'public/components/';
const componentSuffix = 'Component';
const gitignore = '.gitignore';

console.log('\t===============================\n'
    , '\t= Скрипт компиляции шаблонов  =\n'
    , '\t=      Команды SaberDevs      =\n'
    , '\t===============================');

const currentDir = path.basename(path.resolve('.'));
if (currentDir !== correctLaunchDir) {
  console.log('\tВы запустили меня из '
      , currentDir
      , '\n\tНо я очень нежный код'
      , '\n\tПожалуйста, запусти меня в '
      , correctLaunchDir
      , '\n\t===============================');
}

fs.readdir(devRoot + templatesDir, (err, files) => {
  if (err) {
    return console.log(err);
  }

  const gitignoreFileNames = [];

  files.forEach((filename) => {
    // проверяем, что не директория, и что разрешение есть
    const dotPos = filename.lastIndexOf('.');
    if (dotPos === -1) {
      return;
    }
    // трогаем только pug
    const ext = filename.slice(dotPos + 1);
    if (ext != 'pug') {
      return;
    }
    const functionName = filename.slice(filename.lastIndexOf('/') + 1,
        filename.lastIndexOf('.'));

    // Compile a function
    const compiledTemplate = pug.compileFileClient(
        devRoot + templatesDir + filename
        , {name: 'x(){};\n\nexport default function ' +
            functionName + componentSuffix});

    // запоминаем для гитигнора
    const JSFilename = outDir + filename.replace(/pug/, 'js');
    gitignoreFileNames.push(JSFilename);

    fs.writeFileSync(
        JSFilename
        , compiledTemplate
        , 'utf8',
    );
    console.log('Шаблон', filename, 'преобразован в', JSFilename);
  });

  let gitignoreContent = fs.readFileSync(gitignore, 'utf8');

  console.log('файлы:');
  gitignoreFileNames.forEach((filename) => {
    if (gitignoreContent.indexOf(filename) === -1) {
      gitignoreContent += (filename + '\n');
      console.log('\t' + filename);
    }
  });

  fs.writeFile(
      gitignore
      , gitignoreContent
      , 'utf8'
      , (err) => {
        if (err) {
          return console.log(err);
        }
        console.log('были добавлены в', gitignore);
      });
});
