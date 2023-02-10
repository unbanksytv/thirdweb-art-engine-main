const basePath = process.cwd();
const { ThirdwebStorage } = require('@thirdweb-dev/storage');
const { readdir, readFileSync, writeFile, writeFileSync, mkdir, existsSync, removeSync } = require('fs-extra');
const thirdwebFolder = `${basePath}/build/thirdweb`;
const tempFolder = `${basePath}/.temp`;

// initialize thirdweb upload sdk
const storage = new ThirdwebStorage();

// thirdweb pre-upload function
(async () => {
    
    const imagesPath = `${basePath}/build/images`;
    let imageFiles = [];

    // read json data
    let rawdata = readFileSync(`${basePath}/build/json/_metadata.json`);
    let data = JSON.parse(rawdata);

    // save the state that imagaes are now pre-uploaded
    const state = { isPreUploaded: true };
    if(!existsSync(tempFolder)) {
        mkdir(tempFolder, (err) => { if (err) throw err } );
    }
    writeFile(`${tempFolder}/temp.json`, JSON.stringify(state), (err) => {  if (err) throw err });

    // delete thirdweb folder if existing
    if (existsSync(thirdwebFolder)) {
        removeSync(thirdwebFolder, { recursive: true });
    }

    readdir(imagesPath, async (err, files) => {
        //handling error
        if (err) {
            return console.log(`[status]: Build image folder doesn't exist: ${err}`);
        }
        
        // list all files inside build image folder
        files.forEach((file) => {
            imageFiles.push({ name: file, data: readFileSync(`${imagesPath}/${file}`) })
        });

        console.log('[wait]: Uploading...')

        // upload and pin the files to the IPFS
        const uri = await storage.uploadBatch(imageFiles);
        const cid = `ipfs://${storage.resolveScheme(uri[0]).slice(32, -6)}`;
        console.log(`[status]: Images Base URI => ${cid}`);

        // update the metadata json folder
        data.forEach((item) => {
            item.image = `${cid}/${item.edition}.png`;
            writeFileSync(
                `${basePath}/build/json/${item.edition}.json`,
                JSON.stringify(item, null, 2)
            );
        });

        writeFileSync(
            `${basePath}/build/json/_metadata.json`,
            JSON.stringify(data, null, 2)
        );

        console.log('[done]: Image Base URI added to existing metadata ./');
    });

})();
