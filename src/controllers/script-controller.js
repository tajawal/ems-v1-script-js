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
        // Defining Context object
        const contextobj = { count: 8 }

// Contextifying stated object
// using createContext method
        vm.createContext(contextobj);

// Compiling code by using runInContext
// method with its parameter
        vm.runInContext('count *= 4;', contextobj);

// Displays output
        console.log("The output is: ", contextobj);
        reply.code(HttpStatus.OK).header('Content-Type', 'application/json').send(JSON.stringify(contextobj));
    } catch  (e) {
        request.log.error(e);
        return Boom.boomify(e);
    }
};



module.exports = { executeOne };

