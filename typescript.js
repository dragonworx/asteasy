const ts = require('typescript');
const Parser = require('./parser');

module.exports = class TypeScriptParser extends Parser {
  parse (sourceCode, inputFile) {
    return ts.createSourceFile(inputFile, sourceCode, ts.ScriptTarget.Latest, true);
  }

  getMetaNode (nodeType, astNode, level) {
    return {
      type: nodeType,
      level: level,
      children: {},
      text: astNode.getText(),
      node: astNode,
    };
  }

  getRange (astNode) {
    return [astNode.pos, astNode.end];
  }

  getNodeType (astNode) {
    return ts.SyntaxKind[astNode.kind];
  }

  visitChildren (astNode, level, metaNode) {
    // astNode.forEachChild(childNode => this.visit(childNode, level + 1, metaNode));
    astNode.getChildren().forEach(childNode => this.visit(childNode, level + 1, metaNode));
  }
};