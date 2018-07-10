let i = 0;

module.exports = class MetaNode {
  constructor (astNode) {
    this.node = astNode;
    this.children = {};
    this.id = i++;
    this.cache();
  }
};