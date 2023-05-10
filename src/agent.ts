import {
  Finding,
  FindingSeverity,
  FindingType,
  HandleTransaction,
  TransactionEvent,
} from "forta-agent";

/*
{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"int256","name":"amount0","type":"int256"},{"indexed":false,"internalType":"int256","name":"amount1","type":"int256"},{"indexed":false,"internalType":"uint160","name":"sqrtPriceX96","type":"uint160"},{"indexed":false,"internalType":"uint128","name":"liquidity","type":"uint128"},{"indexed":false,"internalType":"int24","name":"tick","type":"int24"}],"name":"Swap","type":"event"}
*/
const ExactInputSingleParams =
  "tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96)";
const ExactOutputSingleParams =
  "tuple(address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 deadline, uint256 amountOut, uint256 amountInMinimum, uint160 sqrtPriceLimitX96)";
const ExactInputParams =
  "tuple(bytes path, address recipient, uint256 deadline, uint256 amountIn, uint256 amountOutMinimum)";
const ExactOutputParams =
  "tuple(bytes path, address recipient, uint256 deadline, uint256 amountOut, uint256 amountInMaximum)";

export const UNI_SWAP_CALLS = [
  `function exactInputSingle(${ExactInputSingleParams} params) external returns (uint256 amountOut)`,
  `function exactInput(${ExactInputParams} params) external returns (uint256 amountOut)`,
  `function exactOutputSingle(${ExactOutputSingleParams} params) external returns (uint256 amountIn)`,
  `function exactOutput(${ExactOutputParams} params) external returns (uint256 amountIn)`,
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

  // filter the transaction logs for Tether transfer events
  const uniSwapFunctionCalls = txEvent.filterFunction(
    UNI_SWAP_CALLS,
    UNI_SWAP_ROUTER_ADDRESS
  );

  uniSwapFunctionCalls.forEach((swapFunctionCall) => {
    // extract transfer event arguments
    //const { params } = swapFunctionCall.args;
    // push to findins
    findings.push(
      Finding.fromObject({
        name: "Uniswap swap detected!",
        description: `Someone made a swap on the uniswap platform.`,
        alertId: "FORTA-uniswapSwapAlert",
        severity: FindingSeverity.Info,
        type: FindingType.Info,
        metadata: {},
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
