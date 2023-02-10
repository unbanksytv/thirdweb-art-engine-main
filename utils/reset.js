const basePath = process.cwd();
const { existsSync, removeSync } = require('fs-extra');
const tempFolder = `${basePath}/.temp`;
const buildFolder = `${basePath}/build`;

(() => {
    if (existsSync(tempFolder)) {
        removeSync(tempFolder, (err) => { 
            if (err) throw err;
            console.log('[status]: Temp folder deleted ./');
        });
    } else {
        console.log('[status]: Temp folder does not exists :/');
    }
    if (existsSync(buildFolder)) {
        removeSync(buildFolder, (err) => { 
            if (err) throw err
            console.log('[status]: Build folder deleted ./');
        });
    } else {
        console.log('[status]: Build folder does not exists :/');
    }
})();