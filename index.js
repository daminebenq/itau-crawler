const fs = require('fs');
const Itau = require('./lib/itau-crawler');

Itau
  .getExtract()
  .then((result) => {
    fs.writeFile('./debug/table.html', result, (err, res) => {
      console.log('done');
    });
  });