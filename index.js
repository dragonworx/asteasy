const astQuery = require('./astQuery');

const sampleQueries = {
  "basic": {
    'ClassMethod/BlockStatement': (node, i, nodes, parser) => {
      const ast = astQuery.parseScript(`const a:string = 'foo'`, {
        plugins: ['typescript']
      });
      node.body.splice(0, 0, ...ast);
      const output = parser.generate();
      console.log(output.code);
    },
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

// astQuery(`./test/*.ts`, sampleQueries.basic, {
//   plugins: [
//     'jsx',
//     'typescript',
//   ],
//   log: true,
//   debug: false,
// });

const Table = require('./table');

const table = new Table([
  {
    size: 8,
    align: 'center',
    blank: '.',
  },
  {
    size: 10,
    align: 'right',
    blank: '.',
  },
]);

table.log([
  '1234567890',
  'efg',
], {
  0: 'blue',
  1: 'red'
});