"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const tslib_1 = require("tslib");
const http_1 = tslib_1.__importDefault(require("http"));
const express_1 = tslib_1.__importDefault(require("express"));
const express_session_1 = tslib_1.__importDefault(require("express-session"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const logging_1 = tslib_1.__importDefault(require("./config/logging"));
const config_1 = tslib_1.__importDefault(require("./config/config"));
require("./config/passport");
const routes_1 = tslib_1.__importDefault(require("./routes/routes"));
const connect_dynamodb_1 = tslib_1.__importDefault(require("connect-dynamodb"));
const DynamoDBStore = (0, connect_dynamodb_1.default)({ session: express_session_1.default });
const app = (0, express_1.default)();
exports.app = app;
var options = {
    table: 'condition-monitoring-sessions',
    AWSConfigJSON: {
        region: config_1.default.aws.region,
    },
    readCapacityUnits: 5,
    writeCapacityUnits: 5,
};
const httpServer = http_1.default.createServer(app);
app.use((req, res, next) => {
    logging_1.default.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        logging_1.default.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
app.use((0, express_session_1.default)({
    store: new DynamoDBStore(options),
    secret: config_1.default.session.secret,
    saveUninitialized: false,
    resave: false,
    cookie: {
        sameSite: 'none',
        secure: true
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.header('origin'));
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
app.use(routes_1.default);
app.use((req, res, next) => {
    const error = new Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
httpServer.listen(config_1.default.server.port, () => logging_1.default.info(`Server is running on port ${config_1.default.server.port}`));
//# sourceMappingURL=server.js.map