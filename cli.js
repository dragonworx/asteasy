#!/usr/bin/env node
const fs = require('fs');
const AstQuery = require('./astQuery');

const [,, ...args] = process.argv;
const glob = args[0];
const query = args[1];

if (query === '-t') {
  AstQuery.glob(glob, null);
} else {
  const querySource = fs.readFileSync(query, 'utf-8');
  let queryContent = null;
  eval('queryContent = ' + querySource);
  AstQuery.glob(glob, queryContent);
}