"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invokeRuleEngine = void 0;
const missingModuleMessage = 'ruleEngine module could not be resolved. Ensure the external dependency is installed and accessible to the backend runtime.';
function resolveRuleEngine() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-return
        return require('ruleEngine');
    }
    catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(missingModuleMessage, error);
        }
        return async () => {
            throw new Error(missingModuleMessage);
        };
    }
}
const ruleEngine = resolveRuleEngine();
async function invokeRuleEngine(payload) {
    return Promise.resolve(ruleEngine(payload));
}
exports.invokeRuleEngine = invokeRuleEngine;
