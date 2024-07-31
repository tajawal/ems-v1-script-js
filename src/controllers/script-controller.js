const Boom = require('boom');
const HttpStatus = require('http-status-codes/index');
const util = require('util');
const vm = require('vm');
const fs = require('fs');


/**
 *
 * @param request
 * @param reply
 */
const executeOne = async (request, reply) => {

    try {
        var contextVaribales = { util, fs };
        contextVaribales = mergeRequestData(contextVaribales, request);
        console.log(contextVaribales); // 42
// Define the context with Node.js built-in modules
        vm.createContext(contextVaribales);
        // const x = 1;
        // const context = { x: 2 };
        // vm.createContext(context); ==> here context will be global variables
        // vm.createContext(context); // Contextify the object.

        const code = 'x += 40; var y = 17;';
        console.log("XXXZZZZZ"); // 42
        vm.runInContext(request.body.inputScript, contextVaribales);

        const extractedMap = new Map();

        let responseVariables = request.body.response;
        responseVariables.forEach(key => {
            if (key in contextVaribales) {
                extractedMap.set(key, contextVaribales[key]);
            }
        });

        const resultObject = mapToObject(extractedMap);

        console.log("lklklklklk"); // 42
        console.log(extractedMap); // 42
        console.log(resultObject); // 42

        // console.log(x); // 1; y is not defined.
        // const contextobj = { count: 8 }
        // // let consoleOutput = '';
        // //
        // // // Redirect console.log to capture output
        // // contextobj.console = {
        // //     log: (...args) => {
        // //         consoleOutput += args;
        // //     }
        // // };
        // console.log("cccc");
        // vm.createContext(contextobj);
        // console.log("ddddd");
        // vm.runInContext(request.body.inputScript, contextobj);
        // console.log("mmmmm");
        // // contextobj.consoleOutput = consoleOutput;
        // console.log("The output is: ", contextobj.consoleOutput);
        // console.log("The output is: ", contextobj);
        console.log("vvvvvv");
        reply.code(HttpStatus.OK)
            .header('Content-Type', 'application/json')
            .send(JSON.stringify(resultObject));
    } catch  (e) {
        console.log("xxxxxx");
        console.error(e.message);
        return Boom.boomify(e);
    }
};


function mergeRequestData(contextVaribales, requestData) {
    let requestVariables = requestData.body.map;
    if (Array.isArray(requestVariables) && requestVariables.length > 0) {
        requestVariables.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                contextVaribales = { ...contextVaribales, ...item };
            }
        });
    }
    return contextVaribales;
}

const mapToObject = (map) => {
    return Object.fromEntries(map);
};

module.exports = { executeOne };

