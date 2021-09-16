const fs = require('fs');
const path = require('path');

const correctLaunchDir = '2021_2_SaberDevs';
const devRoot = "dev/"
const outRoot = "public/components"
const templatesDir = "components/"

function transformTemplate(filename) {
    // уберешь utf8 - будешь читать побайтово. data станет переменной типа fs.Buffer
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) return console.log(err);

        const ext = filename.slice(filename.lastIndexOf('.') + 1);
        // трогаем только js
        if (ext != 'js') return;

        const functionName = filename.slice(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'));
        const result = data.replace(/function template/g, '\n\nexport default function ' + functionName);
      
        fs.writeFile(filename, result, 'utf8', (err) => {
           if (err) return console.log(err);
           console.log("\tФайл", functionName + '.' + ext, "преобразован");
        });
    })
};


console.log("\t===============================");
console.log("\t= Скрипт компиляции шаблонов  =");
console.log("\t=      Команды SaberDevs      =");
console.log("\t===============================");

const currentDir = path.basename(path.resolve('.'));
if (currentDir !== correctLaunchDir) {
    console.log("\tВы запустили меня из " + currentDir);
    console.log("\tНо я очень нежный код");
    console.log("\tПожалуйста, запусти меня в " + correctLaunchDir);
    console.log("\t===============================");
}

fs.readdir(devRoot + templatesDir, (err, files) => {
    if (err) return console.log(err);
    files.forEach(file => {
        transformTemplate(devRoot + templatesDir + file);
    });
});