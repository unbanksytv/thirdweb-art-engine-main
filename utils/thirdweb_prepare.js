const basePath = process.cwd();
const { mkdir, copy, readFile, existsSync, removeSync } = require('fs-extra');

const buildFolder = 'build';
const buildTWFolder = buildFolder+'/thirdweb';
const buildImagesFolder = buildFolder+'/images';
const buildJSONFolder = buildFolder+'/json';
const tempFolder = `${basePath}/.temp/`;
const thirdwebFolder = `${basePath}/.temp/`;

(async () => {

    // [status]: Preparing thirdweb folder
    console.log('[status]: Preparing thirdweb folder...');

    // if thirdweb folder exists, delete it
    if (existsSync(thirdwebFolder)) {
        removeSync(`${basePath}/build/thirdweb`, (err) => { if (err) throw err });
        
        // [status]: Existing folder detected, deleting...
        console.log('[status]: Existing folder detected, deleting...');
    }

    // create thirdweb folder
    mkdir(buildTWFolder, err => {
        (err) ? console.log(err) : console.log('[status]: New folder for thirdweb created ./');
    });

    // check the state if the images are pre-uploaded
    if (existsSync(tempFolder)) {
        readFile(`${basePath}/.temp/temp.json`, (err, data) => {
            if (err) throw err;
            const state = JSON.parse(data);

            // if the image pre-uploaded, copy the metadata json files only to thirdweb folder
            if (state.isPreUploaded) {
                copy(buildJSONFolder+'/_metadata.json', buildTWFolder+'/_metadata.json', err => {
                    (err) ? console.log(err) : console.log('[status]: Metadata copied to thirdweb folder ./');
                });
            }
        });
    } else {
        // copy the metadata json files to thirdweb folder
        copy(buildJSONFolder+'/_metadata.json', buildTWFolder+'/_metadata.json', err => {
            (err) ? console.log(err) : console.log('[status]: Metadata copied to thirdweb folder ./');
        });

        // copy the image files to thirdweb folder
        copy(buildImagesFolder+'/', buildTWFolder+'/', err => {
            (err) ? console.log(err) : console.log('[status]: Images copied to thirdweb folder ./');
        });
    }

})();
