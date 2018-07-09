const TypeScriptParser = require('./typescript');
const JavascriptParser = require('./javascript');
const path = require('path');

module.exports = {
  parse (inputFile) {
    if (path.extname(inputFile).toLowerCase() === '.js') {
      return new JavascriptParser(inputFile);
    } else if (path.extname(inputFile).toLowerCase() === '.ts') {
      return new TypeScriptParser(inputFile);
    }
  }
};