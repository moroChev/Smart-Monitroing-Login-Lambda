"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const passport_1 = tslib_1.__importDefault(require("passport"));
const passport_saml_1 = require("passport-saml");
const config_1 = tslib_1.__importDefault(require("./config"));
const logging_1 = tslib_1.__importDefault(require("./logging"));
passport_1.default.serializeUser((expressUser, done) => {
    logging_1.default.info(expressUser, 'Serialize User');
    done(null, expressUser);
});
passport_1.default.deserializeUser((expressUser, done) => {
    logging_1.default.info(expressUser, 'Deserialize User');
    done(null, expressUser);
});
passport_1.default.use(new passport_saml_1.Strategy({
    issuer: config_1.default.saml.issuer,
    protocol: 'https://',
    path: '/login/callback',
    entryPoint: config_1.default.saml.entryPoint,
    cert: fs_1.default.readFileSync(config_1.default.saml.cert, 'utf-8')
}, (expressUser, done) => {
    return done(null, expressUser);
}));
//# sourceMappingURL=passport.js.map