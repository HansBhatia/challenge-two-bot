import {
  Finding,
  FindingSeverity,
  FindingType,
  HandleTransaction,
  TransactionEvent,
} from "forta-agent";

export const UNI_SWAP_CALLS = [
  `event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)`,
];
export const UNI_SWAP_ROUTER_ADDRESS =
  "0xE592427A0AEce92De3Edee1F18E0157C05861564";
let findingsCount = 0;

const handleTransaction: HandleTransaction = async (
  txEvent: TransactionEvent
) => {
  const findings: Finding[] = [];

  // limiting this agent to emit only 5 findings so that the alert feed is not spammed
  if (findingsCount >= 5) return findings;

  console.log(txEvent);

  // filter the transaction logs for Tether transfer events
  const uniSwapFunctionCalls = txEvent.filterLog(UNI_SWAP_CALLS);

  uniSwapFunctionCalls.forEach((swapFunctionCall) => {
    // extract transfer event arguments
    const { recipient, sender } = swapFunctionCall.args;
    // push to findins
    findings.push(
      Finding.fromObject({
        name: "Uniswap swap detected!",
        description: `Someone made a swap on the uniswap platform.`,
        alertId: "FORTA-uniswapSwapAlert",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        metadata: { to: recipient, from: sender },
      })
    );
    findingsCount++;
  });

  return findings;
};

// const initialize: Initialize = async () => {
//   // do some initialization on startup e.g. fetch data
// }

// const handleBlock: HandleBlock = async (blockEvent: BlockEvent) => {
//   const findings: Finding[] = [];
//   // detect some block condition
//   return findings;
// }

// const handleAlert: HandleAlert = async (alertEvent: AlertEvent) => {
//   const findings: Finding[] = [];
//   // detect some alert condition
//   return findings;
// }

export default {
  // initialize,
  handleTransaction,
  // handleBlock,
  // handleAlert
};
