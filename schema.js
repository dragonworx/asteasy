module.exports = schema = {
  nodeName (metaNode) {
    return metaNode.type;
  },
  childNodes (metaNode) {
    const children = [];
    for (let key in metaNode.children) {
      children.push.apply(children, metaNode.children[key]);
    }
    return children;
    // const children = metaNode.getChildren();
    // return children;
  },
  nodeValue (metaNode) {
    return metaNode.text;
  },
  attributes () {
    return {
      
    }
  },
};