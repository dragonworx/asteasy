const astQuery = require('./astQuery');

const sampleQueries = {
  "basic": {
    'Identifier[@name = "ContextImpl"]': node => console.log(node),
  },
  "simple": {
    'ClassDeclaration//ClassMethod//NewExpression/Identifier[@name = "ContextImpl"]': node => console.log(node),
  },
  "simple1": {
    '//VariableDeclaration[@kind = "const"]': node => console.log(node)
  },
  "nested": {
    'ClassDeclaration': {
      'ClassMethod': {
        'Identifier[@name = "ContextImpl"]': node => console.log(node.type)
      },
    },
  },
};

astQuery(`./test/*.js`, sampleQueries.nested, {
  plugins: [
    'jsx',
    'typescript',
  ],
  log: false,
  debug: true,
});