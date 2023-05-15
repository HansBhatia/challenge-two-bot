import { BigNumber } from "ethers";
import { Finding, FindingSeverity, FindingType, HandleTransaction, createTransactionEvent } from "forta-agent";
import agent, { UNI_SWAP_CALLS } from "./agent";

describe("uniswap swap detection bot", () => {
  let handleTransaction: HandleTransaction;
  const mockTxEvent = createTransactionEvent({} as any);

  beforeAll(() => {
    handleTransaction = agent.handleTransaction;
  });

  describe("handleTransaction", () => {
    it("returns empty findings if there are no swaps", async () => {
      mockTxEvent.filterLog = jest.fn().mockReturnValue([]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(UNI_SWAP_CALLS);
    });

    it("returns a finding if there is a Swap", async () => {
      const mockUniswapSwapEvent = {
        args: {
          recipient: "0xalice",
          sender: "0xbob",
          amount0: BigNumber.from("-100").toString(),
          amount1: BigNumber.from("2000").toString(),
        },
      };
      mockTxEvent.filterLog = jest.fn().mockReturnValue([mockUniswapSwapEvent]);

      const findings = await handleTransaction(mockTxEvent);

      expect(findings).toStrictEqual([
        Finding.fromObject({
          name: "Uniswap swap detected!",
          description: `Someone made a swap on the uniswap platform.`,
          alertId: "FORTA-uniswapSwapAlert",
          severity: FindingSeverity.Info,
          type: FindingType.Info,
          metadata: {
            to: mockUniswapSwapEvent.args.recipient,
            from: mockUniswapSwapEvent.args.sender,
            fromTokenAmount: mockUniswapSwapEvent.args.amount0,
            toTokenAmount: mockUniswapSwapEvent.args.amount1,
          },
        }),
      ]);
      expect(mockTxEvent.filterLog).toHaveBeenCalledTimes(1);
      expect(mockTxEvent.filterLog).toHaveBeenCalledWith(UNI_SWAP_CALLS);
    });
  });
});
