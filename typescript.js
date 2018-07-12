const ts = require('typescript');
const Parser = require('./parser');
const MetaNode = require('./metaNode');

class TypeScriptMetaNode extends MetaNode {
  cache () {
    this.range = [this.node.pos, this.node.end];
    this.type = ts.SyntaxKind[this.node.kind];
    this.text = this.node.getText();
  }

  getChildren () {
    // astNode.forEachChild(childNode => this.visit(childNode, level + 1, metaNode));
    return this.node.getChildren();
  }
}

module.exports = class TypeScriptParser extends Parser {
  getRootASTNode (sourceCode) {
    // todo: check jsx flag
    return ts.createSourceFile('inputFile.ts', sourceCode, ts.ScriptTarget.Latest, true);
  }

  getMetaNode (astNode) {
    return new TypeScriptMetaNode(astNode);
  }

  get lang () {
    return 'TypeScript';
  }
};