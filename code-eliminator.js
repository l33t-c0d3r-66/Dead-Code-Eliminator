const fs = require('fs-extra'),
    path = require('path'),
    Confirm = require('prompt-confirm');

const esprima = require('esprima');
const escodegen = require('escodegen');
async function run(passedRunOptions) {
    if (!passedRunOptions) { 
        console.log("Invalid Passed Arguemnts");
    } else {
        let modifiedCode = removeUnusedFunctions(passedRunOptions["inputFile"]);
        
        console.log("Writting Modified Code:");
        fs.writeFileSync(passedRunOptions["outputFile"], modifiedCode, "utf-8");
        console.log("File Written");
    }
    
    
}

function removeUnusedFunctions(inputFile) {
    let code = fs.readFileSync(inputFile, "utf-8");
    const ast = esprima.parseScript(code, { range: true, loc: true });
  
    const declaredFunctions = {}
    const calledFunctions = {};

    function traverse(node) {
      if (
        (node.type === 'VariableDeclaration' && node.kind === 'const' && node.declarations.length === 1 &&
          node.declarations[0].init && (node.declarations[0].init.type === 'ArrowFunctionExpression' || node.declarations[0].init.type === 'FunctionExpression'))
      ) {
        if (node.declarations[0].id && node.declarations[0].id.type === 'Identifier') {
          declaredFunctions[node.declarations[0].id.name] = true;
        }
      } else if(node.type ==  'FunctionDeclaration') {
          if (node.id && node.id.type === 'Identifier') {
              declaredFunctions[node.id.name] = true;
          }
      } else if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
        calledFunctions[node.callee.name] = true;
      }
  
      for (const key in node) {
        if (node.hasOwnProperty(key)) {
          const child = node[key];
          if (typeof child === 'object' && child !== null) {
            traverse(child);
          }
        }
      }
    }
  
    traverse(ast);
  
    // Identify unused arrow functions
    const unusedArrowFunctions = Object.keys(declaredFunctions).filter(fun => !calledFunctions[fun]);
    // Remove unused arrow functions from the AST
    ast.body = ast.body.filter((node) => {
      if (
        node.type === 'VariableDeclaration' &&
        node.kind === 'const' &&
        node.declarations.length === 1 &&
        node.declarations[0].init &&
        (node.declarations[0].init.type === 'ArrowFunctionExpression' ||  node.declarations[0].init.type === 'FunctionExpression')
        && (unusedArrowFunctions.includes(node.declarations[0].id.name))) {
        return false;
      } else if(node.type ==  'FunctionDeclaration' && node.id &&
      (unusedArrowFunctions.includes(node.id.name))) {
          return false;
      }
      return true;
    });
  
    const modifiedCode = escodegen.generate(ast);
  
    return modifiedCode;
  }
  

module.exports = {
    run
}
