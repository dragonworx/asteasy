(() => ({
  'ClassDeclaration': {
    'MethodDeclaration': {
      'NewExpression/Identifier[text() = "ContextImpl"]': node => {
        console.log(2, node.text);
      }
    }
  }
}))();