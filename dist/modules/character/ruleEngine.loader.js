"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeRuleEngine = void 0;
const missingModuleMessage = 'ruleEngine module could not be resolved. Ensure the external dependency is installed and accessible to the backend runtime.';
let hasLoggedMissingModule = false;
function resolveRuleEngine() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-return
        return require('ruleEngine');
    }
    catch (error) {
        if (!hasLoggedMissingModule) {
            hasLoggedMissingModule = true;
            if (process.env.NODE_ENV !== 'production') {
                console.warn(missingModuleMessage);
            }
        }
        return async (payload) => ({
            warnings: [missingModuleMessage],
            input: payload
        });
    }
}
const ruleEngine = resolveRuleEngine();
async function invokeRuleEngine(payload) {
    return Promise.resolve(ruleEngine(payload));
}
exports.invokeRuleEngine = invokeRuleEngine;
