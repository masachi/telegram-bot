const { v4: uuidv4 } = require('uuid');

const handler = async (ctx, next) => {
    try {
        let body = await next();
        ctx.response.body = {
            code: "success",
            message: 'success',
            success: true,
            data: body || {},
            requestId: uuidv4()
        };
    } catch (e) {
        ctx.response.status = 500;
        ctx.response.body = {
            code: "fail",
            message: 'fail',
            success: false,
            data: e.message
        };
    }
};

module.exports = handler;