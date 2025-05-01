import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";

export const TOKENS: Record<NetworkType, Record<Address, string>> = {
  Mainnet: {
    "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0": "wstETH",
    "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84": "STETH",

    "0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811": "pzETH",
    "0x84631c0d0081FDe56DeB72F6DE77abBbF6A9f93a": "Re7LRT",
    "0x7a4EffD87C2f3C55CA251080b1343b605f327E3a": "rstETH",
    "0xBEEF69Ac7870777598A04B2bd4771c71212E6aBc": "steakLRT",
    "0x5fD13359Ba15A84B76f7F87568309040176167cd": "amphrETH",
    "0x5E362eb2c0706Bd1d134689eC75176018385430B": "DVstETH",
  },
  Optimism: {
    "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb": "wstETH",
  },
  Arbitrum: {
    "0x5979D7b546E38E414F7E9822514be443A4800529": "wstETH",
  },
  Base: {},
  Sonic: {},

  Monad: {},
  MegaETH: {},
  Berachain: {},
  Avalanche: {},
  BNB: {},
  WorldChain: {},
};

export const PROTOCOL = "lido";
