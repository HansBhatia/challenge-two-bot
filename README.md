# Uniswap Swap Detection Bot

## Description

This agent detects swaps that occur on the uniswap v3 protocol.

## Supported Chains

- Ethereum

## Alerts

- FORTA-uniswapSwapAlert
  - Fired when a Swap event is emitted.
  - Severity is always set to "Info"
  - Type is always set to "info"
  - Metadata contains:
    - The token swapped from (from), and the token swapped to (to). Two other fields toTokenAmount and fromTokenAmount which provide the change in values when swapped.

## Test Data

The agent behaviour can be verified with the following transactions:

- 0x7b15fd54a79b6b4ca22ae30c4f96ad4dc82b8fd63c51b4366f75dda388434dba (Swap 1700 USDT -> Ether)
