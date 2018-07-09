const fs = require('fs');
const jsel = require('jsel');
const schema = require('./schema');
const chalk = require('chalk');
// const Table = require('tty-table');

module.exports = class Parser {
  constructor (inputFile) {
    const sourceCode = fs.readFileSync(inputFile, 'utf-8');
    this.source = sourceCode.toString();
    const astNode = this.parse(sourceCode, inputFile);
    const metaNode = this.visit(astNode, 0);
    const dom = jsel(metaNode);
    dom.schema(schema);
    this.dom = dom;
  }

  parse (sourceCode, inputFile) {
    throw 'Not Implemented!';
  }

  visit (astNode, level, parentNode) {
    const nodeType = this.getNodeType(astNode);
    const metaNode = this.getMetaNode(nodeType, astNode, level);
  
    if (parentNode) {
      parentNode.children[nodeType] = parentNode.children[nodeType] || [];
      parentNode.children[nodeType].push(metaNode);
    }
  
    if (nodeType) {
      const range = this.getRange(astNode);
      const output = `${chalk.gray('.'.repeat(level + 1)) + chalk.cyan(nodeType)}:`.padEnd(50, ' ') +
        `${chalk.blue(`${range[0]}:${range[1]}`)} `.padEnd(17, ' ') + 
        `${chalk.yellow(this.source.substring(range[0], range[1]).split('\n')[0].trim())}`;
      console.log(output);
    }
  
    this.visitChildren(astNode, level, metaNode);
  
    return metaNode;
  }

  getRange (astNode) {
    throw 'Not Implemented!';
  }

  getNodeType (astNode) {
    throw 'Not Implemented!';
  }

  visitChildren (astNode, level, metaNode) {
    throw 'Not Implemented!';
  }

  select (xpath) {
    return this.dom.select(xpath);
  }

  selectAll (xpath) {
    return this.dom.selectAll(xpath);
  }
};