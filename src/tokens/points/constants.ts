import type { Address } from "viem";

import type { NetworkType } from "../../core/chains";

export type PointsResult = Record<Address, PointsInfo>;
export type PointsHandler = (network: NetworkType) => Promise<PointsResult>;

export type PointsType =
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
  | "pumpBTC"
  | "obol"
  | "ssv"
  | "boyco"
  | "kodiak"
  | "dolomite"
  | "beraWave"
  | "treehouseNuts"
  | "rings"
  | "sonic"
  | "shift"
  | "omni"
  | "sPoint";

interface PointsReward {
  name: string;
  units: string;
  multiplier: bigint | "soon";
  type: PointsType;
}

interface DebtReward extends PointsReward {
  cm: Address;
}

type CommonReward<CM extends DebtReward["cm"] | undefined> =
  CM extends undefined ? PointsReward : DebtReward;

export const REWARDS_BASE_INFO = {
  etherfi: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Ether.fi",
    units: "points",
    multiplier,
    type: "etherfi",
  }),
  kelp: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Kernel",
    units: "Points",
    multiplier,
    type: "kelp",
  }),
  ethena: <CM extends DebtReward["cm"] | undefined = undefined>(
    multiplier: PointsReward["multiplier"],
    cm?: CM,
  ): CommonReward<CM> => {
    return {
      name: "Ethena",
      units: "sats",
      multiplier,
      type: "ethena",
      ...(cm ? { cm } : {}),
    } as CommonReward<CM>;
  },

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

  obol: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Obol",
    units: "points",
    multiplier,
    type: "obol",
  }),
  ssv: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "SSV",
    units: "points",
    multiplier,
    type: "ssv",
  }),
  boyco: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Boyco",
    units: "rewards",
    multiplier,
    type: "boyco",
  }),
  kodiak: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Kodiak",
    units: "points",
    multiplier,
    type: "kodiak",
  }),
  beraWave: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Bera-wave",
    units: "points",
    multiplier,
    type: "beraWave",
  }),
  dolomite: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Dolomite",
    units: "points",
    multiplier,
    type: "dolomite",
  }),
  treehouseNuts: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Treehouse",
    units: "nuts",
    multiplier,
    type: "treehouseNuts",
  }),

  rings: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Rings",
    units: "points",
    multiplier,
    type: "rings",
  }),
  sonic: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "Sonic",
    units: "points",
    multiplier,
    type: "sonic",
  }),

  shift: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "SHIFT",
    units: "points",
    multiplier,
    type: "shift",
  }),

  omni: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "OMNI",
    units: "points",
    multiplier,
    type: "omni",
  }),

  sPoint: (multiplier: PointsReward["multiplier"]): PointsReward => ({
    name: "S-Point",
    units: "",
    multiplier,
    type: "sPoint",
  }),
};

export interface PointsInfo {
  symbol: string;
  address: Address;
  rewards: Array<PointsReward>;
  debtRewards?: Array<DebtReward>;
}

export const POINTS_INFO_BY_NETWORK: Record<NetworkType, Array<PointsInfo>> = {
  Mainnet: [
    {
      address: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
      symbol: "weETH",
      rewards: [REWARDS_BASE_INFO.etherfi(200n)],
    },
    {
      address: "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
      symbol: "rsETH",
      rewards: [REWARDS_BASE_INFO.kelp(200n)],
    },

    {
      address: "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497",
      symbol: "sUSDe",
      rewards: [REWARDS_BASE_INFO.ethena(500n)],
      debtRewards: [
        REWARDS_BASE_INFO.ethena(
          500n,
          "0x58c8e983d9479b69b64970f79e8965ea347189c9",
        ),
      ],
    },
    {
      address: "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3",
      symbol: "USDe",
      rewards: [REWARDS_BASE_INFO.ethena(2000n)],
      debtRewards: [
        REWARDS_BASE_INFO.ethena(
          500n,
          "0x58c8e983d9479b69b64970f79e8965ea347189c9",
        ),
      ],
    },

    {
      address: "0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811",
      symbol: "pzETH",
      rewards: [
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
      address: "0xB908c9FE885369643adB5FBA4407d52bD726c72d",
      symbol: "cp0xLRT",
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

    {
      address: "0x72eD19788Bce2971A5ed6401662230ee57e254B7",
      symbol: "stkcvxllamathena",
      rewards: [REWARDS_BASE_INFO.ethena(30_00n)],
    },

    {
      address: "0x5E362eb2c0706Bd1d134689eC75176018385430B",
      symbol: "DVstETH",
      rewards: [
        REWARDS_BASE_INFO.mellow(2_00n),
        REWARDS_BASE_INFO.obol(1_00n),
        REWARDS_BASE_INFO.ssv(1_00n),
      ],
    },

    {
      address: "0x97Ad75064b20fb2B2447feD4fa953bF7F007a706",
      symbol: "beraSTONE",
      rewards: [
        REWARDS_BASE_INFO.boyco(1_00n),
        REWARDS_BASE_INFO.kodiak(1_00n),
        REWARDS_BASE_INFO.dolomite(1_00n),
        REWARDS_BASE_INFO.beraWave(1_00n),
      ],
    },

    {
      address: "0xD11c452fc99cF405034ee446803b6F6c1F6d5ED8",
      symbol: "tETH",
      rewards: [REWARDS_BASE_INFO.treehouseNuts(1_00n)],
    },

    {
      address: "0xbEeFc011e94f43b8B7b455eBaB290C7Ab4E216f1",
      symbol: "csUSDL",
      rewards: [REWARDS_BASE_INFO.shift(1_00n)],
    },
  ],
  Arbitrum: [
    {
      address: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
      symbol: "USDe",
      rewards: [REWARDS_BASE_INFO.ethena(2000n)],
    },
    {
      address: "0x4186BFC76E2E237523CBC30FD220FE055156b41F",
      symbol: "rsETH",
      rewards: [REWARDS_BASE_INFO.kelp(300n)],
    },
  ],
  Optimism: [],
  Base: [],
  Sonic: [
    {
      address: "0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE",
      symbol: "scUSD",
      rewards: [REWARDS_BASE_INFO.rings(1_50n)],
    },
  ],

  Monad: [],
  MegaETH: [],
  Berachain: [],
  Avalanche: [],
  BNB: [
    {
      address: "0x7788A3538C5fc7F9c7C8A74EAC4c898fC8d87d92",
      symbol: "sUSDX",
      rewards: [REWARDS_BASE_INFO.sPoint(1_00n)],
    },
  ],
  WorldChain: [],
};
