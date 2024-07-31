const controller = require('../../controllers/script-controller');
const schema = require('../schemas/script-schema');

/**
 * Info routes endpoints
 */
module.exports = () => {
    return [
        {
            method: 'POST',
            url: '/script/execute',
            schema: schema.executeOne,
            handler: controller.executeOne
        }
    ];
};
