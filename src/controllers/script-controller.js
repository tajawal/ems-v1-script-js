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

        let output = contextVariables["output"];

        if (typeof output !== "object") {
            throw new Error("output type is missed, or it should be an object")
        }

        if (!Object.keys(output).length) {
            throw new Error("output should have at lest on key")
        }

        const resultList = [];
        for (const [key, value] of Object.entries(output)) {
            resultList.push({
                key: key,
                value: value,
                type: typeof value
            });
        }

        console.debug(resultList);
        reply.code(HttpStatus.OK)
            .header('Content-Type', 'application/json')
            .send(JSON.stringify(resultList));
    } catch (e) {
        console.error(e.message);
        var error = new Error(e);
        error.status = 400;
        throw error
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

