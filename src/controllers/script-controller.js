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
        var contextVariables = {util};
        contextVariables = mergeRequestData(contextVariables, request);
        vm.createContext(contextVariables);
        vm.runInContext(request.body.scriptCode, contextVariables);

        let responseVariables = request.body.requiredOutputFields;

        const transformInputToOutput = (outputList, inputMap) => {
            return Array.from(outputList).reduce((acc, key) => {
                let val = inputMap[key];
                acc[key] = {
                    value: val,
                    type: typeof val
                };
                return acc;
            }, {});
        };

        const resultObject = transformInputToOutput(responseVariables, contextVariables);
        console.debug(resultObject);
        reply.code(HttpStatus.OK)
            .header('Content-Type', 'application/json')
            .send(JSON.stringify(resultObject));
    } catch (e) {
        console.debug(e.message);
        return Boom.boomify(e);
    }
};


function mergeRequestData(contextVaribales, requestData) {

    let requestVariables = requestData.body.scriptInputMap;
    console.debug(requestVariables);
    if (Array.isArray(requestVariables) && requestVariables.length > 0) {
        requestVariables.forEach(item => {
            if (typeof item === 'object' && item !== null) {
                contextVaribales = {...contextVaribales, ...item};
            }
        });
    }
    return contextVaribales;
}

const mapToObject = (input) => {
    return Object.fromEntries(input);
};

module.exports = {executeOne: executeScript};

