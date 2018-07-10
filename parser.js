const jsel = require('jsel');
const schema = require('./schema');
const path = require('path');
const log = require('./log');
const chalk = require('chalk');

module.exports = class Parser {
  constructor (sourceCode) {
    this.source = sourceCode.toString();
    this.stack = [];
    log('ast', this.lang.toUpperCase(), 'green');
  }

  setRootASTNode (astNode) {
    // log('setRootASTNode', astNode);
    this.rootASTNode = astNode;
    this.metaNode = this.visit(astNode, 0);
    const dom = jsel(this.metaNode);
    dom.schema(schema);
    this.dom = dom;
  }

  setRootMetaNode (metaNode, options = {}) {
    if (!options.silent) {
      // log('setRootMetaNode', metaNode);
    }
    this.rootASTNode = metaNode.node;
    this.metaNode = metaNode;
    const dom = jsel(this.metaNode);
    dom.schema(schema);
    this.dom = dom;
  }

  push (metaNode) {
    this.setRootMetaNode(metaNode, { silent: true });
    this.stack.push(metaNode);
  }

  pop () {
    const metaNode = this.stack.pop();
    if (metaNode) {
      this.setRootMetaNode(metaNode, { silent: true });
    }
  }

  static inputFile (inputFile, sourceCode) {
    if (path.extname(inputFile).toLowerCase() === '.js') {
      const JavascriptParser = require('./javascript');
      return new JavascriptParser(sourceCode);
    } else if (path.extname(inputFile).toLowerCase() === '.ts') {
      const TypeScriptParser = require('./typescript');
      return new TypeScriptParser(sourceCode);
    }
  }
  
  getRootASTNode (sourceCode, inputFile) {
    throw 'Not Implemented!';
  }

  visit (astNode, level, parentMetaNode) {
    const metaNode = this.getMetaNode(astNode);
    const nodeType = metaNode.type;
  
    if (nodeType) {
      if (parentMetaNode) {
        parentMetaNode.children[nodeType] = parentMetaNode.children[nodeType] || [];
        parentMetaNode.children[nodeType].push(metaNode);
      }
      const range = metaNode.range;
      const bg = 'bgWhite';
      const output = `${chalk.gray('.'.repeat(level + 1)) + chalk.cyan(nodeType)}:`.padEnd(50, ' ') +
        `${chalk.blue(`${range[0]}:${range[1]}`)} `.padEnd(17, ' ') + 
        `${chalk.yellow(this.source.substring(range[0], range[1]).replace(/\n/g, '↩️').trim())}`;
      console.log(output);
    }
  
    metaNode.getChildren().forEach(childNode => this.visit(childNode, level + 1, metaNode));
  
    return metaNode;
  }

  assertRootASTNode () {
    if (!this.rootASTNode) {
      const rootASTNode = this.getRootASTNode(this.source);
      this.setRootASTNode(rootASTNode);
    }
  }

  select (xpath) {
    this.assertRootASTNode();
    return this.dom.select(xpath);
  }

  selectAll (xpath) {
    this.assertRootASTNode();
    return this.dom.selectAll(xpath);
  }

  get lang () {
    throw 'Not Implemented!';
  }
};