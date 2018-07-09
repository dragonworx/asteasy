const esprima = require('esprima');
const Parser = require('./parser');

module.exports = class JavaScriptParser extends Parser {
  parse (sourceCode) {
    return esprima.parse(sourceCode, { sourceType: 'module', range: true });
  }

  getMetaNode (nodeType, astNode, level) {
    return {
      type: nodeType,
      level: level,
      children: {},
      text: astNode.name,
      node: astNode,
    };
  }

  getRange (astNode) {
    return [astNode.pos, astNode.end];
  }

  getNodeType (astNode) {
    return astNode.type;
  }

  visitChildren (astNode, level, metaNode) {
    const children = [];

    for (let key in astNode) {
      const val = astNode[key];
      if (Array.isArray(val)) {
        children.push.apply(children, val);
      } else if (typeof val === 'object' && val !== null) {
        children.push(val);
      }
    }

    children.forEach(childNode => this.visit(childNode, level + 1, metaNode));
  }
};