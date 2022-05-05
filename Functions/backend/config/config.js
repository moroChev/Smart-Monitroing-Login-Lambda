"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    saml: {
        cert: process.env.CERTFILE ?
            __dirname + process.env.CERTFILE
            : __dirname + '/bp-preprod-saml.pem',
        entryPoint: process.env.SAML_ENTRY_POINT || 'https://castrol-idp-pp.bpglobal.com/idp/endpoint/HttpRedirect?expid=conditionmonitoring',
        issuer: process.env.SAML_ISSUER || 'http://localhost:8081',
        options: {
            failureRedirect: '/login',
            failureFlash: true
        }
    },
    server: {
        port: process.env.PORT || 8081
    },
    session: {
        resave: false,
        secret: process.env.SESSION_SECRET || 'topcodersecret',
        saveUninitialized: true
    },
    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
    aws: {
        region: process.env.AWS_REGION || 'us-east-1'
    },
    settings: {
        isLocal: process.env.IS_LOCAL || false,
        rolePrefix: process.env.ROLE_PREFIX || 'arn:aws:iam::822143204215:role/USER-PUD_',
    }
};
exports.default = config;
//# sourceMappingURL=config.js.map