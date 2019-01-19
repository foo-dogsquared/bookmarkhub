class api_response {
    constructor(success, extra) {
        this.success = success;
        this.extra = extra || {};
    }
}

api_response.prototype.DB_ERROR = 1;

module.exports = api_response;
