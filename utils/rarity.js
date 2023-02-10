const basePath = process.cwd();
const fs = require("fs");

// read json data
let rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
let data = JSON.parse(rawdata);
let editionSize = data.length;

let rarityData = [];

// fill up rarity chart with occurrences from metadata
// working rarity code here: https://github.com/HashLips/hashlips_art_engine/issues/1025#issuecomment-1122721584
data.forEach((element) => {
  let attributes = element.attributes;
  attributes.forEach((attribute) => {
    let traitType = attribute.trait_type;
    let value = attribute.value;
    let found = false;

    if (rarityData[traitType]) {
      let rarityDataTraits = rarityData[traitType];
      rarityDataTraits.forEach((rarityDataTrait) => {
        if (rarityDataTrait.trait == value) {
          // keep track of occurrences
          rarityDataTrait.occurrence++;
          found = true;
        }
      });
    } else {
      rarityData[traitType] = [];
    }

    if (!found) {
      // just get name for each element
      let rarityDataElement = {
        trait: value,
        occurrence: 1, // initialize at 1
      };
      rarityData[traitType].push(rarityDataElement);
    }
  });
});

// convert occurrences to occurence string
for (var layer in rarityData) {
  for (var attribute in rarityData[layer]) {
    // get chance
    let chance =
      ((rarityData[layer][attribute].occurrence / editionSize) * 100).toFixed(2);

    // show two decimal places in percent
    rarityData[layer][attribute].occurrence =
      `${rarityData[layer][attribute].occurrence} in ${editionSize} editions (${chance} %)`;
  }
}

// print out rarity data
// changes from: https://github.com/HashLips/hashlips_art_engine/pull/513/commits/b819e0af4bfcbc10dfa9b3b5e642fd38287b6907
for (var layer in rarityData) {
  if (process.argv.length <= 2) {
    console.log(`Trait type: ${layer}`);
    for (var trait in rarityData[layer]) {
      console.log(rarityData[layer][trait]);
    }
    console.log();
  }
  else {
    if (process.argv[2] == "table") {
      console.log(`Trait type: ${layer}`);
      console.table(rarityData[layer]);
    }
  }
}
