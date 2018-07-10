const esprima = require('esprima');
const Parser = require('./parser');
const MetaNode = require('./metaNode');

class JavaScriptMetaNode extends MetaNode {
  cache () {
    this.range = this.node.range;
    this.type = this.node.type;
    this.text = this.node.name;
  }

  getChildren () {
    const children = [];

    for (let key in this.node) {
      const val = this.node[key];
      if (Array.isArray(val)) {
        children.push.apply(children, val);
      } else if (typeof val === 'object' && val !== null) {
        children.push(val);
      }
    }

    return children;
  }
}

module.exports = class JavaScriptParser extends Parser {
  getRootASTNode (sourceCode) {
    return esprima.parse(sourceCode, { sourceType: 'module', range: true });
  }

  getMetaNode (astNode) {
    return new JavaScriptMetaNode(astNode);
  }

  get lang () {
    return 'JavaScript';
  }
};