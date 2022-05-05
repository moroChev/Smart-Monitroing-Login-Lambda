"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DEFAULT_NAMESPACE = 'ConditionMonitoring';
const info = (message, namespace) => {
    if (typeof message === 'string') {
        console.log(`[${getDate()}] [${namespace || DEFAULT_NAMESPACE}] [INFO] ${message}`);
    }
    else {
        console.log(`[${getDate()}] [${namespace || DEFAULT_NAMESPACE}] [INFO]`, message);
    }
};
const warn = (message, namespace) => {
    if (typeof message === 'string') {
        console.log(`[${getDate()}] [${namespace || DEFAULT_NAMESPACE}] [WARN] ${message}`);
    }
    else {
        console.log(`[${getDate()}] [${namespace || DEFAULT_NAMESPACE}] [WARN]`, message);
    }
};
const error = (message, namespace) => {
    if (typeof message === 'string') {
        console.log(`[${getDate()}] [${namespace || DEFAULT_NAMESPACE}] [ERROR] ${message}`);
    }
    else {
        console.log(`[${getDate()}] [${namespace || DEFAULT_NAMESPACE}] [ERROR]`, message);
    }
};
const getDate = () => {
    return new Date().toISOString();
};
exports.default = { info, warn, error };
//# sourceMappingURL=logging.js.map