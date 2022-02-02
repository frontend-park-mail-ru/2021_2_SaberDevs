const fs = require('fs');
const path = require('path');

const correctLaunchDir = '2021_2_SaberDevs';
const root = 'public';
const targetFile = 'globals';

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
const mode = !(process.argv[2] === 'false');
const sw = process.argv[3] === 'sw';

console.log(
    `[START] ===============================
    \t=      Console.log > ${mode}${mode === 'true' ? ' ' : ''}    =
    \t=      Командa SaberDevs      =
    \t===============================`,
);

fs.readFile(root + '/' + targetFile, 'utf8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  const currentMode = mode ? 'false' : 'true';
  const currentModeReg = new RegExp(currentMode, 'gs');

  let result = data.replace(
      currentModeReg,
      `${mode}`,
  );
  if (sw && mode) {
    result = result.replace(
        'disableSW = true',
        'disableSW = false',
    );
  }
  fs.writeFileSync(
      root + '/' + targetFile,
      result,
      'utf8',
  );
  console.log(
      `[DONE]  console.logs were set to ${mode}`,
  );
});
