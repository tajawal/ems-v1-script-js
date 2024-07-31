const HttpStatus = require('http-status-codes');

const errorSchema = require('./common/error-schema');
const notFoundSchema = require('./common/not-found-schema');

const scriptCreateSchema = {
    type: 'object',
    properties: {
        inputScript: { type: 'string', example: 'script to be executed' }
    },
    required: ['inputScript']
};


module.exports = {
    executeOne: {
        description: 'Execute Script',
        tags: ['ScriptNode'],
        summary: 'Execute the script',
        body: scriptCreateSchema,
        response: {
            [HttpStatus.OK]: {
                description: 'Successful response',
                type: 'object',
                properties: {
                    result: { type: 'string' }
                },
            },
            [HttpStatus.BAD_REQUEST]: notFoundSchema,
            [HttpStatus.INTERNAL_SERVER_ERROR]: errorSchema
        }
    }
};
