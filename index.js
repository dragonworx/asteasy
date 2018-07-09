const SourceFactory = require('./sourceFactory');
const glob = require('glob-fs')({ gitignore: true });
const chalk = require('chalk');
const util = require('util');

const testXPath = {
  ts: '//ClassDeclaration//MethodDeclaration//NewExpression/Identifier[text() = "ContextImpl"]',
  js: '//ClassDeclaration//MethodDefinition//NewExpression/Identifier[text() = "ContextImpl"]',
};

const lang = 'js';

const logLine = (len, color = 'white') => console.log(chalk[color]('-'.repeat(len)));

const astNodeRange = (astNode) => astNode.range ? astNode.range : [astNode.pos, astNode.end];

glob.readdirStream(`./test/*.${lang}`, {})
  .on('data', function (file) {
    const filePath = file.path;
    const xpath = testXPath[lang];
    logLine(6 + filePath.length, 'gray');
    console.log(chalk.keyword('orange')('file: ') + chalk.blue(filePath));
    console.log(chalk.magenta(xpath));
    logLine(xpath.length, 'gray');
    const parser = SourceFactory.parse(filePath);
    const res = parser.selectAll(xpath);
    console.log(chalk[res.length >= 1 ? 'green' : 'red'](`${res.length} result(s)`));
    for (let i = 0; i < res.length; i++) {
      const val = res[i];
      console.log(chalk.hex('#DEADED').bold(`${i + 1}/${res.length}`));
      if (val) {
        console.log(chalk.bold.white(util.inspect(val.node)));
        const range = astNodeRange(val.node);
        console.log('"' + chalk.yellow(parser.source.substring(range[0], range[1])) + '"');
      } else {
        console.log(chalk.gray('nothing...'));
      }
    }
  });