import type { Address } from "viem";

import type { NetworkType } from "../utils";

type PointsType =
  | "eigenlayer"
  | "renzo"
  | "etherfi"
  | "kelp"
  | "swell"
  | "puffer"
  | "ethena"
  | "symbiotic"
  | "mellow"
  | "lombard"
  | "babylon"
  | "veda"
  | "karak"
  | "pumpBTC";

export interface PointsReward {
  name: string;
  units: string;
  multiplier: bigint | "soon";
  type: PointsType;
  cms?: Array<Address>;
}

const REWARDS_BASE_INFO = {
  eigenlayer: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Eigenlayer",
    units: "points",
    multiplier,
    type: "eigenlayer",
  }),
  renzo: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Renzo",
    units: "points",
    multiplier,
    type: "renzo",
  }),
  etherfi: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Ether.fi",
    units: "points",
    multiplier,
    type: "etherfi",
  }),
  kelp: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Kelp",
    units: "Miles",
    multiplier,
    type: "kelp",
  }),
  swell: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Swell",
    units: "points",
    multiplier,
    type: "swell",
  }),
  puffer: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Puffer",
    units: "points",
    multiplier,
    type: "puffer",
  }),
  ethena: (
    multiplier: PointsReward["multiplier"],
    cms?: PointsReward["cms"],
  ): PointsReward => ({
    name: "Ethena",
    units: "sats",
    multiplier,
    type: "ethena",
    cms,
  }),

  symbiotic: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Symbiotic",
    units: "points",
    multiplier,
    type: "symbiotic",
  }),
  mellow: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Mellow",
    units: "points",
    multiplier,
    type: "mellow",
  }),

  lombard: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Lombard",
    units: "points",
    multiplier,
    type: "lombard",
  }),
  babylon: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Babylon",
    units: "points",
    multiplier,
    type: "babylon",
  }),

  veda: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Veda",
    units: "points",
    multiplier,
    type: "veda",
  }),
  karak: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Karak",
    units: "points",
    multiplier,
    type: "karak",
  }),

  pumpBTC: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Pump BTC",
    units: "points",
    multiplier,
    type: "pumpBTC",
  }),
};

export interface PointsInfo {
  symbol: string;
  address: Address;
  rewards: Array<PointsReward>;
  debtRewards?: Array<PointsReward>;
}

export const POINTS_INFO_BY_NETWORK: Record<NetworkType, Array<PointsInfo>> = {
  Mainnet: [
    {
      address: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
      symbol: "weETH",
      rewards: [
        REWARDS_BASE_INFO.eigenlayer(100n),
        REWARDS_BASE_INFO.etherfi(200n),
      ],
    },
    {
      address: "0xbf5495Efe5DB9ce00f80364C8B423567e58d2110",
      symbol: "ezETH",
      rewards: [
        REWARDS_BASE_INFO.eigenlayer(100n),
        REWARDS_BASE_INFO.renzo(300n),
      ],
    },
    {
      address: "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
      symbol: "rsETH",
      rewards: [
        REWARDS_BASE_INFO.eigenlayer(100n),
        REWARDS_BASE_INFO.kelp(200n),
      ],
    },
    {
      address: "0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0",
      symbol: "rswETH",
      rewards: [
        REWARDS_BASE_INFO.eigenlayer(100n),
        REWARDS_BASE_INFO.swell(450n),
      ],
    },
    {
      address: "0xD9A442856C234a39a81a089C06451EBAa4306a72",
      symbol: "pufETH",
      rewards: [
        REWARDS_BASE_INFO.eigenlayer(100n),
        REWARDS_BASE_INFO.puffer(100n),
      ],
    },

    {
      address: "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497",
      symbol: "sUSDe",
      rewards: [REWARDS_BASE_INFO.ethena(500n)],
      debtRewards: [
        REWARDS_BASE_INFO.ethena(500n, [
          "0x58c8e983d9479b69b64970f79e8965ea347189c9",
        ]),
      ],
    },
    {
      address: "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3",
      symbol: "USDe",
      rewards: [REWARDS_BASE_INFO.ethena(2000n)],
      debtRewards: [
        REWARDS_BASE_INFO.ethena(500n, [
          "0x58c8e983d9479b69b64970f79e8965ea347189c9",
        ]),
      ],
    },

    {
      address: "0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811",
      symbol: "pzETH",
      rewards: [
        REWARDS_BASE_INFO.renzo(300n),
        REWARDS_BASE_INFO.symbiotic(100n),
        REWARDS_BASE_INFO.mellow(200n),
      ],
    },
    {
      address: "0x7a4EffD87C2f3C55CA251080b1343b605f327E3a",
      symbol: "rstETH",
      rewards: [
        REWARDS_BASE_INFO.symbiotic(100n),
        REWARDS_BASE_INFO.mellow(200n),
      ],
    },
    {
      address: "0xBEEF69Ac7870777598A04B2bd4771c71212E6aBc",
      symbol: "steakLRT",
      rewards: [
        REWARDS_BASE_INFO.symbiotic(100n),
        REWARDS_BASE_INFO.mellow(200n),
      ],
    },
    {
      address: "0x5fD13359Ba15A84B76f7F87568309040176167cd",
      symbol: "amphrETH",
      rewards: [
        REWARDS_BASE_INFO.symbiotic(100n),
        REWARDS_BASE_INFO.mellow(200n),
      ],
    },

    {
      address: "0x8236a87084f8B84306f72007F36F2618A5634494",
      symbol: "LBTC",
      rewards: [
        REWARDS_BASE_INFO.babylon(100n),
        REWARDS_BASE_INFO.lombard(300n),
      ],
    },
    {
      address: "0x84631c0d0081FDe56DeB72F6DE77abBbF6A9f93a",
      symbol: "Re7LRT",
      rewards: [
        REWARDS_BASE_INFO.symbiotic(100n),
        REWARDS_BASE_INFO.mellow(200n),
      ],
    },

    {
      address: "0x657e8C867D8B37dCC18fA4Caead9C45EB088C642",
      symbol: "eBTC",
      rewards: [
        REWARDS_BASE_INFO.babylon(100n),
        REWARDS_BASE_INFO.symbiotic(100n),
        REWARDS_BASE_INFO.etherfi(200n),
        REWARDS_BASE_INFO.lombard(400n),
        REWARDS_BASE_INFO.veda(300n),
        REWARDS_BASE_INFO.karak(200n),
      ],
    },

    {
      address: "0xF469fBD2abcd6B9de8E169d128226C0Fc90a012e",
      symbol: "pumpBTC",
      rewards: [
        REWARDS_BASE_INFO.babylon(100n),
        REWARDS_BASE_INFO.pumpBTC(200n),
      ],
    },
  ],
  Arbitrum: [
    {
      address: "0x2416092f143378750bb29b79eD961ab195CcEea5",
      symbol: "ezETH",
      rewards: [
        REWARDS_BASE_INFO.eigenlayer(100n),
        REWARDS_BASE_INFO.renzo(300n),
      ],
    },
    {
      address: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
      symbol: "USDe",
      rewards: [REWARDS_BASE_INFO.ethena(2000n)],
    },
    {
      address: "0x4186BFC76E2E237523CBC30FD220FE055156b41F",
      symbol: "rsETH",
      rewards: [
        REWARDS_BASE_INFO.eigenlayer(100n),
        REWARDS_BASE_INFO.kelp(300n),
      ],
    },
  ],
  Optimism: [
    {
      address: "0x2416092f143378750bb29b79eD961ab195CcEea5",
      symbol: "ezETH",
      rewards: [
        REWARDS_BASE_INFO.eigenlayer(100n),
        REWARDS_BASE_INFO.renzo(300n),
      ],
    },
  ],
};
