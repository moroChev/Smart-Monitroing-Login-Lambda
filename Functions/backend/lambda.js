"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const tslib_1 = require("tslib");
require("source-map-support/register");
const serverless_express_1 = tslib_1.__importDefault(require("@vendia/serverless-express"));
const server_1 = require("./server");
exports.handler = (0, serverless_express_1.default)({ app: server_1.app });
//# sourceMappingURL=lambda.js.map