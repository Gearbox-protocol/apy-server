import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

export const TOKENS: Record<NetworkType, Record<Address, string>> = {
  Mainnet: {
    // "0xdA816459F1AB5631232FE5e97a05BBBb94970c95": "yvDAI",
    // "0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE": "yvUSDC",
    // "0xa258C4606Ca8206D8aA700cE2143D7db854D168c": "yvWETH",
    // "0xA696a63cc78DfFa1a63E9E50587C197387FF6C7E": "yvWBTC",
    // "0x3B27F92C0e212C671EA351827EDF93DB27cc0c65": "yvUSDT",
    // "0xdCD90C7f6324cfa40d7169ef80b12031770B4325": "yvCurve_stETH",
    // "0xB4AdA607B9d6b2c9Ee07A275e9616B84AC560139": "yvCurve_FRAX",
  },
  Optimism: {
    // "0x65343F414FFD6c97b0f6add33d16F6845Ac22BAc": "yvDAI",
    // "0xaD17A225074191d5c8a37B50FdA1AE278a2EE6A2": "yvUSDC_e",
    // "0xFaee21D0f0Af88EE72BB6d68E54a90E6EC2616de": "yvUSDT",
    // "0x5B977577Eb8a480f63e11FC615D6753adB8652Ae": "yvWETH",
    // "0x7Edf16076e56FA4c111055fbA1fF5556b8757cFB": "yvWBTC",
    // "0x7D2382b1f8Af621229d33464340541Db362B4907": "yvOP",
  },
  Arbitrum: {},
  Base: {},
  Sonic: {},

  Monad: {},
  MegaETH: {},
  Berachain: {},
  Avalanche: {},
  BNB: {},
  WorldChain: {},
};

export const PROTOCOL = "yearn";
