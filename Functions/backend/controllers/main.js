"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const client_sts_1 = require("@aws-sdk/client-sts");
const client_iotsitewise_1 = require("@aws-sdk/client-iotsitewise");
const axios_1 = tslib_1.__importDefault(require("axios"));
const logging_1 = tslib_1.__importDefault(require("../config/logging"));
const config_1 = tslib_1.__importDefault(require("../config/config"));
const awsConfig = {
    region: config_1.default.aws.region
};
const stsClient = new client_sts_1.STS(awsConfig);
const sitewiseClient = new client_iotsitewise_1.IoTSiteWise(awsConfig);
const rolePrefix = config_1.default.settings.rolePrefix;
const accountNumber = rolePrefix.substring(rolePrefix.indexOf('::') + 2, rolePrefix.lastIndexOf(':'));
async function getPortalList(emailDomain) {
    const accessPolicies = await sitewiseClient.listAccessPolicies({
        iamArn: `${rolePrefix}${emailDomain}`,
        resourceType: 'PORTAL'
    });
    const portalIds = [];
    accessPolicies.accessPolicySummaries?.forEach((policy) => {
        logging_1.default.info(policy, 'Iterating Policy');
        if (policy.resource.portal) {
            portalIds.push(policy.resource.portal.id);
        }
    });
    const portals = [];
    for (let i = 0; i < portalIds.length; i++) {
        const portal = await sitewiseClient.describePortal({ portalId: portalIds[i] });
        logging_1.default.info(portal, 'Describe Portal');
        portals.push({
            name: portal.portalName,
            url: portal.portalStartUrl
        });
    }
    console.log(portals);
    return portals;
}
async function getPortals(user) {
    const email = user.nameID;
    const emailFullDomain = email.split('@').pop();
    const emailDomain = emailFullDomain.substring(0, emailFullDomain.indexOf('.')).toUpperCase();
    logging_1.default.info(`${rolePrefix}${emailDomain}`, 'Constructed Role');
    const result = await stsClient.assumeRole({
        RoleArn: `${rolePrefix}${emailDomain}`,
        RoleSessionName: email
    });
    const federationSignIn = {
        sessionId: result.Credentials?.AccessKeyId,
        sessionKey: result.Credentials?.SecretAccessKey,
        sessionToken: result.Credentials?.SessionToken
    };
    const encodedURI = encodeURIComponent(JSON.stringify(federationSignIn));
    const baseUrl = 'https://signin.aws.amazon.com/federation';
    const signInAction = 'getSigninToken';
    const sessionDuration = '1800';
    const signInTokenUrl = `${baseUrl}?Action=${signInAction}&SessionDuration=${sessionDuration}&Session=${encodedURI}`;
    const signInResponse = await axios_1.default.get(signInTokenUrl);
    const signInToken = signInResponse.data.SigninToken;
    const loginAction = 'login';
    const issuer = encodeURIComponent(config_1.default.frontend.url);
    const destination = encodeURIComponent('https://console.aws.amazon.com');
    const signInUrl = `${baseUrl}?Action=${loginAction}&Issuer=${issuer}&Destination=${destination}&SigninToken=${signInToken}`;
    const portalList = await getPortalList(emailDomain);
    return {
        signInUrl,
        portalList,
        accountNumber
    };
}
const controller = {
    getPortals,
};
exports.default = controller;
//# sourceMappingURL=main.js.map