const glob = require('glob-fs')({ gitignore: true });
const Parser = require('./parser');
const chalk = require('chalk');
const util = require('util');
const fs = require('fs');
const log = require('./log');

module.exports = class ASTQuery {
  constructor (query) {
    this.query = query;
  }

  applyToFile (filePath) {
    /** 
     * walk each key of query config (JSON-like query structure)
     * if typeof value of key/value === 'function'
     *  apply query to current astNode
     *    if match enumerate function for each result node
     * if typeof value of key/value === 'object'
     *  recursive walk each key of value
     */
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    log('file', filePath, 'cyan');
    const parser = Parser.inputFile(filePath, sourceCode);
    parser.assertRootASTNode();
    this.process(parser, this.query, parser.metaNode);
  }

  process (parser, query, metaNode) {
    parser.setRootMetaNode(metaNode);
    Object.keys(query).forEach(key => {
      const value = query[key];
      const xpath = key;
      log('xpath', xpath, 'magenta');
      const nodes = parser.selectAll(xpath);
      const wasResult = nodes && nodes.length;
      log('count', nodes ? nodes.length : 0, wasResult ? 'green' : 'red');
      if (wasResult) {
        if (typeof value === 'function') {
          for (let i = 0; i < nodes.length; i++) {
            value(nodes[i], i, nodes);
          }
        } else if (typeof value === 'object') {
          for (let i = 0; i < nodes.length; i++) {
            parser.push(nodes[i]);
            this.process(parser, value, nodes[i]);
            parser.pop();
          }
        }
      }
    });
  }

  static glob (globPattern, query) {
    const astQuery = new ASTQuery(query);

    glob.readdirStream(globPattern, {})
    .on('data', function (file) {
      const filePath = file.path;
      astQuery.applyToFile(filePath);
    });
  }
};