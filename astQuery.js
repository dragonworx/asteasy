const glob = require('glob-fs')({ gitignore: true });
const Parser = require('./parser');
const fs = require('fs');
const log = require('./log');

class ASTQuery {
  constructor (query, options = {}) {
    this.query = query;
    this.options = options;
  }

  applyToFile (filePath) {
    const sourceCode = fs.readFileSync(filePath, 'utf-8');
    if (this.options.debug) {
      log('file', filePath, 'cyan');
    }
    const parser = new Parser(sourceCode, filePath, this.options);
    this.parser = parser;
    if (this.query) {
      parser.resetScope();
      this.process(this.query, parser.rootMetaNode);
    }
  }

  process (query, metaNode, level = 0) {
    const { parser } = this;
    parser.setMetaScope(metaNode);
    const pad = '.'.repeat(level);
    Object.keys(query).forEach(key => {
      const queryValue = query[key];
      const xpath = (key.substr(0, 2) === '//' ? '' : '//') + key;
      if (this.options.debug) {
        log(pad + 'scope', parser.metaNode.id, 'blue');
        log(pad + 'xpath', xpath, 'magenta');
      }
      const nodes = parser.selectAll(xpath);
      const wasResult = nodes && nodes.length;
      if (this.options.debug) {
        log(pad + 'count', nodes ? nodes.length : 0, wasResult ? 'green' : 'red');
      }
      if (wasResult) {
        if (typeof queryValue === 'function') {
          // pass results to function
          for (let i = 0; i < nodes.length; i++) {
            queryValue(nodes[i], i, nodes);
          }
        } else if (typeof queryValue === 'object') {
          for (let i = 0; i < nodes.length; i++) {
            const metaNode = nodes[i].__metaNode;
            parser.push(metaNode);
            this.process(queryValue, metaNode, level + 1);
            parser.pop();
          }
        }
      }
    });
  }
}

module.exports = function astQuery (filePath, query = undefined, arg3 = {}) {
  const options = arguments.length === 2 && typeof query === 'object' ? query : arg3;
  const astQuery = new ASTQuery(query, options);
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
};