import type { Address } from "viem";

import type { NetworkType } from "../../utils";

export const TOKENS: Record<NetworkType, Record<Address, string>> = {
  Mainnet: {
    "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0": "wstETH",
    "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84": "STETH",
  },
  Optimism: {
    "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb": "wstETH",
  },
  Arbitrum: {
    "0x5979D7b546E38E414F7E9822514be443A4800529": "wstETH",
  },
};

export const PROTOCOL = "lido";
