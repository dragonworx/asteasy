const AstQuery = require('./astQuery');

const sampleQueries = {
  "ts": {
    "simple": {
      'ClassDeclaration//MethodDeclaration//NewExpression/Identifier[text() = "ContextImpl"]': node => {
        console.log(1, node);
      },
    },
    "nested": {
      'ClassDeclaration': {
        'MethodDeclaration': {
          'NewExpression/Identifier[text() = "ContextImpl"]': node => {
            console.log(2, node);
          },
        },
      },
    },
  },
  "js": {
    "simple": {
      'ClassDeclaration//MethodDefinition//NewExpression/Identifier[text() = "ContextImpl"]': node => {
        console.log(3, node);
      },
    },
    "nested": {
      'ClassDeclaration': {
        'MethodDefinition': {
          'NewExpression/Identifier[text() = "ContextImpl"]': node => {
            console.log(4, node);
          },
        },
      },
    },
  },
};

const lang = 'ts';
const sampleQueryName = 'nested';

// AstQuery.glob(`./test/*.${lang}`, sampleQueries[lang][sampleQueryName]);

const parser = require('@babel/parser');
const result = parser.parse('const a:any = <foo>123</foo>', {
  sourceType: 'unambiguous',
  plugins: [
    'jsx',
    'typescript',
  ]
});
console.log(result);