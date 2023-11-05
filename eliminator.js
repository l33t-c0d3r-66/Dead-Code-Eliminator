'use strict';

const codeEliminator = require("./code-eliminator");
const commandLineArgs = require('command-line-args');
    let argv = null;
    try {
        argv = commandLineArgs([
            { name: 'inputFile', type: String, alias: 'i' },
            { name: 'outputFile', type: String, alias: 'o' },
        ]);
    } catch (e) { 
        console.log(e);
    }
    if (!argv) { 
        console.log("Invalid Command Line Args");
    }

    try { 
        codeEliminator.run(argv); 
    } catch (e) { 
        console.log(e); 
    }
