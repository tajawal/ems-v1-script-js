const Boom = require('boom');
const HttpStatus = require('http-status-codes/index');
const util = require('util');
const vm = require('vm');


/**
 *
 * @param request
 * @param reply
 */
const executeScript = async (request, reply) => {
    try {
        var contextVariables = { util};
        contextVariables = mergeRequestData(contextVariables, request);
        console.debug(contextVariables);
        vm.createContext(contextVariables);
        vm.runInContext(request.body.script, contextVariables);


        const extractedMap = new Map();
        let responseVariables = request.body.responseKeys;
        responseVariables.forEach(key => {
            if (key in contextVariables) {
                extractedMap.set(key, contextVariables[key]);
            }
        });

        const resultObject = mapToObject(extractedMap);
        console.debug(resultObject);
        reply.code(HttpStatus.OK)
            .header('Content-Type', 'application/json')
            .send(JSON.stringify(resultObject));
    } catch  (e) {
        console.debug(e.message);
        return Boom.boomify(e);
    }
};


function mergeRequestData(contextVaribales, requestData) {
    let requestVariables = requestData.body.input;
    if (Array.isArray(requestVariables) && requestVariables.length > 0) {
        requestVariables.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                contextVaribales = { ...contextVaribales, ...item };
            }
        });
    }
    return contextVaribales;
}

const mapToObject = (input) => {
    return Object.fromEntries(input);
};

module.exports = { executeOne: executeScript };

