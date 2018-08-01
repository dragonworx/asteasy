const babelParser = require('@babel/parser');
const jsel = require('jsel');
const MetaNode = require('./metaNode');
const schema = require('./schema');
const map = require('./map');
const log = require('./log');
const chalk = require('chalk');
const generate = require('@babel/generator').default;

module.exports = class Parser {
  constructor (sourceCode, inputFilePath, options = {}) {
    this.source = sourceCode.toString();
    this.filePath = inputFilePath;
    this.options = options;
    if (this.options.debug) {
      log('parse', inputFilePath, 'green');
      log('source', sourceCode, 'blue');
      log('filePath', inputFilePath, 'blue');
    }
    this.stack = [];
    const rootASTNode = this.getRootASTNode(this.source);
    this.rootASTNode = rootASTNode;
    this.setASTScope(rootASTNode);
    this.rootMetaNode = this.metaNode;
  }

  resetScope () {
    this.setASTScope(this.rootASTNode);
  }

  getRootASTNode (sourceCode) {
    const { options } = this;
    const babelOptions = {
      sourceType: 'unambiguous',
    };
    for (let key in options) {
      babelOptions[key] = options[key];
    }
    if (this.options.debug) {
      log('options', babelOptions, 'cyan');
    }
    return babelParser.parse(sourceCode, babelOptions);
    
  }

  setMetaScope (metaNode) {
    if (this.options.debug) {
      log('metaScope', metaNode.id, 'blue');
    }
    this.astRoot = metaNode.astNode;
    this.metaNode = metaNode;
  }

  setASTScope (astNode) {
    this.astRoot = astNode;
    if (astNode.__metaNode) {
      this.metaNode = astNode.__metaNode;
    } else {
      if (this.options.debug || this.options.log) {
        log('visit', astNode.type, 'red');
      }
      this.metaNode = this.visit(astNode, 0);
    }
  }

  visit (astNode, level, parentMetaNode) {
    if (astNode.__metaNode) {
      return astNode.__metaNode;
    }

    const metaNode = new MetaNode(astNode);
    metaNode.level = level;
    astNode.__metaNode = metaNode;
    const nodeType = metaNode.type;

    if (this.options.debug) {
      log('@', metaNode.id, 'red');
    }
  
    if (nodeType) {
      if (parentMetaNode) {
        if (this.options.debug) {
          log('parent', parentMetaNode.id, 'red');
        }
        parentMetaNode.children[nodeType] = parentMetaNode.children[nodeType] || [];
        parentMetaNode.children[nodeType].push(metaNode);
      }

      const range = metaNode.range;
      const previewMaxLen = 50;
      let preview = this.source.substring(range.start, range.end).replace(/\n/g, '↩️').trim();
      if (preview.length > previewMaxLen) {
        preview = preview.substr(0, previewMaxLen) + '...';
      }

      const output = `${chalk.white(range.loc.start.line)}: ${chalk.gray(`${range.start}: ${range.end - range.start}`)} `.padEnd(17, ' ') + 
        `${chalk.gray('.'.repeat(level + 1)) + chalk.cyan(nodeType)}:`.padEnd(50, ' ') +
        `${chalk.yellow(preview)}`;

      if (this.options.log) {
        console.log(output);
      }
    }
  
    
    metaNode.getChildren().forEach(childNode => this.visit(childNode, level + 1, metaNode));
  
    return metaNode;
  }

  select (xpath) {
    const dom = jsel(this.metaNode);
    dom.schema(schema);
    dom.map(map);
    const result = dom.select(xpath);
    if (result instanceof MetaNode) {
      return result.astNode;
    }
    return result;
  }

  selectAll (xpath) {
    const dom = jsel(this.metaNode);
    dom.schema(schema);
    dom.map(map);
    const result = dom.selectAll(xpath);
    return result.map(node => node instanceof MetaNode ? node.astNode : node);
  }

  push (metaNode) {
    this.setMetaScope(metaNode);
    this.stack.push(metaNode);
  }

  pop () {
    const metaNode = this.stack.pop();
    if (this.stack.length) {
      this.setMetaScope(metaNode);
    } else {
      this.setMetaScope(this.rootMetaNode);
    }
  }

  generate () {
    return generate(this.rootASTNode);
  }
};