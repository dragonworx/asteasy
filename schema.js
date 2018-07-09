module.exports = schema = {
  nodeName (node) {
    return node.type;
  },
  childNodes (node) {
    const children = [];
    for (let key in node.children) {
      children.push.apply(children, node.children[key]);
    }
    return children;
  },
  nodeValue (node) {
    return node.text;
  }
};