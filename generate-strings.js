const fs = require('fs');
const path = require('path');

const stringsDirectory = 'strings';
const outputFilename = 'strings.json';

const availableLanguages = fs.readFileSync('availableLanguages.json')
const languageMeta = JSON.parse(availableLanguages).data

const strings = {};

function readLanguageFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const langCode = path.basename(filePath, '.json');
    const langStrings = JSON.parse(content);
    strings[langCode] = {
        message: langStrings,
        meta: languageMeta.find(e => e.data.languageId === langCode) || {
            data: {
                languageId: "en",
                translationProgress: 100,
                approvalProgress: 100
            }
        }
    };
}

function generateStringsJSON() {
    const files = fs.readdirSync(stringsDirectory);
    files.forEach((file) => {
        console.log(file)
        const filePath = path.join(stringsDirectory, file);
        if (fs.statSync(filePath).isFile()) {
            readLanguageFile(filePath);
        }
    });

    const output = JSON.stringify(strings, null, 2);
    fs.writeFileSync(outputFilename, output);
    console.log(`Generated ${outputFilename}`);
}

generateStringsJSON();
