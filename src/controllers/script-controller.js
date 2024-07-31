const Boom = require('boom');
const HttpStatus = require('http-status-codes/index');
const util = require('util');
const vm = require('vm');


/**
 *
 * @param request
 * @param reply
 */
const executeOne = async (request, reply) => {

    try {
        var contextVaribales = { util};
        contextVaribales = mergeRequestData(contextVaribales, request);
        console.log(contextVaribales);
        vm.createContext(contextVaribales);
        vm.runInContext(request.body.inputScript, contextVaribales);


        const extractedMap = new Map();
        let responseVariables = request.body.response;
        responseVariables.forEach(key => {
            if (key in contextVaribales) {
                extractedMap.set(key, contextVaribales[key]);
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

