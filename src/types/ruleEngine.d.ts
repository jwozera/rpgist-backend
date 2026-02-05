import type { RuleEngineInput, RuleEngineOutput } from './rule-engine';

declare module 'ruleEngine' {
  const ruleEngine: (payload: RuleEngineInput) => RuleEngineOutput | Promise<RuleEngineOutput>;

  export default ruleEngine;
  export type { RuleEngineInput, RuleEngineOutput };
}
