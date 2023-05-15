import { Finding, FindingSeverity, FindingType, HandleTransaction, TransactionEvent } from "forta-agent";

export const UNI_SWAP_CALLS = [
  `event Swap(address indexed sender, address indexed recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)`,
];
export const UNI_SWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

const provideHandleTransaction: () => HandleTransaction = () => {
  const handleTransaction: HandleTransaction = async (txEvent: TransactionEvent) => {
    const findings: Finding[] = [];

    // filter the transaction logs for Tether transfer events
    const uniSwapFunctionCalls = txEvent.filterLog(UNI_SWAP_CALLS);

    uniSwapFunctionCalls.forEach((swapFunctionCall) => {
      // extract transfer event arguments
      const { recipient, sender, amount0, amount1 } = swapFunctionCall.args;
      // push to findins
      findings.push(
        Finding.fromObject({
          name: "Uniswap swap detected!",
          description: `Someone made a swap on the uniswap platform.`,
          alertId: "FORTA-uniswapSwapAlert",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: { to: recipient, from: sender, fromTokenAmount: amount0, toTokenAmount: amount1 },
        })
      );
    });

    return findings;
  };

  return handleTransaction;
};

export default {
  handleTransaction: provideHandleTransaction(),
};
