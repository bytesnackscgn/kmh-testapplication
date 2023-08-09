const dotenv = require('dotenv');

const files = {
  ...dotenv.config({ path: '../.env' }).parsed,
  ...dotenv.config({ path: `../.env.${process.env.ENVIRONMENT}` }).parsed,
  ...dotenv.config({ path: `../.env.${process.env.ENVIRONMENT}.local` }).parsed
};

module.exports = function () {
  for (key in files) {
    if (typeof files[key] !== 'string') {
      files[key] = JSON.stringify(files[key]);
    }
  }
  return files;
};