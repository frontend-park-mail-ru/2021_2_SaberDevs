const fs = require('fs');
const path = require('path');
const pug = require('pug');

const correctLaunchDir = '2021_2_SaberDevs';
const devRoot = "dev/";
const templatesDir = "components/";
const outDir = "public/components/";
const componentSuffix = "Component";



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
    files.forEach(filename => {
        // проверяем, что не директория, и что разрешение есть
        const dotPos = filename.lastIndexOf('.');
        if (dotPos == -1) return
        // трогаем только pug
        const ext = filename.slice(dotPos + 1);
        if (ext != 'pug') return;

        const functionName = filename.slice(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'));
        // Compile a function
        // Дебил, смотри доку внимательнее
        // https://pugjs.org/api/reference.html
        const compiledTemplate = pug.compileFileClient(devRoot + templatesDir + filename, {name: 'x(){};\n\nexport default function ' + functionName + componentSuffix});

        fs.writeFile(outDir + filename.replace(/pug/, "js"), compiledTemplate, 'utf8', (err) => {
            if (err) return console.log(err);
            console.log("\Шаблон", filename, "преобразован в " + outDir + functionName + ".js");
        });
    });
});



// Не нужна. Пускай лежит. Позволяет исправлять уже сгенерированные pug'ом js-файлы
function transformTemplate(filename) {
    // уберешь utf8 - будешь читать побайтово. data станет переменной типа fs.Buffer
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) return console.log(err);

        const ext = filename.slice(filename.lastIndexOf('.') + 1);
        // трогаем только js
        if (ext != 'js') return;

        const functionName = filename.slice(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'));
        const result = data.replace(/function template/g, '\n\nexport default function ' + functionName);
      
        fs.writeFile(outDir + filename, result, 'utf8', (err) => {
           if (err) return console.log(err);
           console.log("\tФайл", functionName + '.' + ext, "преобразован");
        });
    })
};
