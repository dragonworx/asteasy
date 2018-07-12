const glob = require('glob-fs')({ gitignore: true });
const Parser = require('./parser');
const fs = require('fs');
const log = require('./log');

module.exports = class ASTQuery {
  constructor (query) {
    this.query = query;
  }

  applyToFile (filePath) {
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    log('file', filePath, 'cyan');
    const parser = Parser.inputFile(filePath, sourceCode);
    parser.assertRootASTNode();
    if (this.query) {
      this.process(parser, this.query, parser.metaNode);
    }
  }

  process (parser, query, metaNode, level = 0) {
    // TODO: get relative xpath to work
    parser.setRootMetaNode(metaNode);
    const pad = '.'.repeat(level);
    Object.keys(query).forEach(key => {
      const value = query[key];
      const xpath = (key.substr(0, 2) === '//' ? '' : '//') + key;
      log(pad + 'xpath', xpath, 'magenta');
      const nodes = parser.selectAll(xpath);
      const wasResult = nodes && nodes.length;
      log(pad + 'count', nodes ? nodes.length : 0, wasResult ? 'green' : 'red');
      if (wasResult) {
        if (typeof value === 'function') {
          for (let i = 0; i < nodes.length; i++) {
            value(nodes[i], i, nodes);
          }
        } else if (typeof value === 'object') {
          for (let i = 0; i < nodes.length; i++) {
            parser.push(nodes[i]);
            this.process(parser, value, nodes[i], level + 1);
            parser.pop();
          }
        }
      }
    });
  }

  static glob (filePath, query = undefined) {
    const astQuery = new ASTQuery(query);
    // todo: jsx
    if (filePath.indexOf('*') === -1) {
      // single file
      astQuery.applyToFile(filePath);
    } else {
      // glob
      glob.readdirStream(filePath, {})
        .on('data', function (file) {
          const filePath = file.path;
          astQuery.applyToFile(filePath);
        });
    }
  }
};