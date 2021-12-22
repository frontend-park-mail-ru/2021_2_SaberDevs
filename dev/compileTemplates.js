const fs = require('fs');
const path = require('path');
const pug = require('pug');

// ///////////////////////////////// //
//
//   Сохранить <pugFileName>.pug
//   в components/<somewhere>/<pugFileName>.pug.js
//   Если не нужно, чтобы шаблон был сохранен,
//   ставим ''s
//
//   Синтаксис: <pugFileName>: <somewhere>
//   default: <pugFileName>: <pugFileName>
//
// ///////////////////////////////// //
const saveTo = {
  card: 'feed',
  mainPagePreviewBar: 'feed/previews',
  formRow: 'signupForm',
  formSettingsRow: 'settings',
  formSettingsTextarea: 'settings',
  buttonNav: 'sidebar',
  userPreview: 'sidebar',
  streamComment: 'sidebar',
  articleEditor: 'editor',
  articleReader: 'reader',
  comment: 'reader',
  articleAddComment: 'reader',
  tag: 'editor',

  // будут игнорировны
  categoryMixin: '',
  _onAvatarErrorMixin: '',
  avatarMixin: '',
  shareMixin: '',
};

const correctLaunchDir = '2021_2_SaberDevs';
const devRoot = 'dev/';
const templatesDir = 'components/';
const outDir = 'public/components/';
const componentSuffix = 'Component';

console.log(`\t===============================
    \t= Скрипт компиляции шаблонов  =
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

// чтение параметра командной строки
const debug = process.argv[2] || false;

fs.readdir(devRoot + templatesDir, (err, files) => {
  if (err) {
    return console.log(err);
  }

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

    // Compile function
    const compiledTemplate = pug.compileFileClient(
        devRoot + templatesDir + filename,
        {
          name: `x(){};\n\nexport default function 
            ${functionName + componentSuffix}`,
          compileDebug: debug? true : false,
        },
    );

    let componentDir = functionName;
    if (functionName in saveTo) {
      componentDir = saveTo[functionName];
    }
    if (componentDir === '') {
      console.warn(`Шаблон ${filename} игнорируется`);
    }
    const JSFilename = outDir + componentDir + '/' + filename + '.js';

    // Создаем директорию компонента
    if (!fs.existsSync(outDir + componentDir)) {
      fs.mkdirSync(outDir + componentDir);
    }

    // Записываем преобразованный паг
    fs.writeFileSync(
        JSFilename,
        compiledTemplate,
        'utf8',
    );
    console.log(`Шаблон ${filename} преобразован в ${JSFilename}`);
  });
});
