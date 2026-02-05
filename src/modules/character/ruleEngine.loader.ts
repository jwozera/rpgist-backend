import type { RuleEngineInput, RuleEngineOutput } from '../../types/rule-engine';

const missingModuleMessage =
  'ruleEngine module could not be resolved. Ensure the external dependency is installed and accessible to the backend runtime.';

let hasLoggedMissingModule = false;

function resolveRuleEngine(): (payload: RuleEngineInput) => RuleEngineOutput | Promise<RuleEngineOutput> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-return
    return require('ruleEngine');
  } catch (error) {
    if (!hasLoggedMissingModule) {
      hasLoggedMissingModule = true;

      if (process.env.NODE_ENV !== 'production') {
        console.warn(missingModuleMessage);
      }
    }

    return async (payload: RuleEngineInput) => ({
      warnings: [missingModuleMessage],
      input: payload
    });
  }
}

const ruleEngine = resolveRuleEngine();

export async function invokeRuleEngine(payload: RuleEngineInput): Promise<RuleEngineOutput> {
  return Promise.resolve(ruleEngine(payload));
}
