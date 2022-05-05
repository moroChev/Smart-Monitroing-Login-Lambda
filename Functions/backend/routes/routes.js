"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const passport_1 = tslib_1.__importDefault(require("passport"));
const config_1 = tslib_1.__importDefault(require("../config/config"));
const logging_1 = tslib_1.__importDefault(require("../config/logging"));
const express_1 = tslib_1.__importDefault(require("express"));
const main_1 = tslib_1.__importDefault(require("../controllers/main"));
const router = express_1.default.Router();
router.get('/health', (req, res) => {
    return res.status(200).json({
        status: 'Condition Monitoring Backend is Healthy'
    });
});
router.get('/login', passport_1.default.authenticate('saml', config_1.default.saml.options), (req, res, next) => {
    return res.redirect(config_1.default.frontend.url);
});
router.post('/login/callback', passport_1.default.authenticate('saml', config_1.default.saml.options), (req, res, next) => {
    return res.redirect(config_1.default.frontend.url);
});
router.get('/portals', async (req, res, next) => {
    if (!req.isAuthenticated()) {
        logging_1.default.info('User not authenticated');
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
    else {
        logging_1.default.info('User authenticated');
        logging_1.default.info(req.user);
        const result = await main_1.default.getPortals(req.user);
        return res.status(200).json({
            user: req.user,
            signInUrl: result.signInUrl,
            portalList: result.portalList
        });
    }
});
exports.default = router;
//# sourceMappingURL=routes.js.map