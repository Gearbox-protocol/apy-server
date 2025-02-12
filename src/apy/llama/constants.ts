import type { Address } from "viem";

import type { NetworkType } from "../../utils";

export const PROTOCOL = "llama";

export const TOKENS: Record<
  NetworkType,
  Record<Address, { id: string; symbol: string }> // symbol to pool
> = {
  Mainnet: {
    "0x83F20F44975D03b1b09e64809B757c47f942BEeA": {
      id: "c8a24fee-ec00-4f38-86c0-9f6daebc4225",
      symbol: "sDAI",
    },
    "0xae78736Cd615f374D3085123A210448E74Fc6393": {
      id: "d4b3c522-6127-4b89-bedf-83641cdcd2eb",
      symbol: "rETH",
    },
    "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38": {
      id: "4d01599c-69ae-41a3-bae1-5fab896f04c8",
      symbol: "osETH",
    },
    "0xDd1fE5AD401D4777cE89959b7fa587e569Bf125D": {
      id: "a4b5b995-99e7-4b8f-916d-8940b5627d70",
      symbol: "auraB_rETH_STABLE_vault",
    },
    "0x276187f24D41745513cbE2Bd5dFC33a4d8CDc9ed": {
      id: "bd072651-d99c-4154-aeae-51f12109c054",
      symbol: "stkcvxcrvFRAX",
    },
    "0x0Bf1626d4925F8A872801968be11c052862AC2D3": {
      id: "654ac683-141b-42d3-b28d-b2f77eedd595",
      symbol: "stkcvxcrvUSDETHCRV",
    },
    "0x7376AD488AB2bd8dF7665d619A4148f0E5094813": {
      id: "411af006-56b0-480a-9586-1071bccbd178",
      symbol: "stkcvxcrvUSDFRAX",
    },
    "0xEE3EE8373384BBfea3227E527C1B9b4e7821273E": {
      id: "3be97c90-d4a8-42b3-a0d0-2906ae4e9d27",
      symbol: "stkcvxcrvUSDTWBTCWETH",
    },
    "0xDb4217B9C8DB788Aa3871d45B4BE6ac5D1FF8C49": {
      id: "755fcec6-f4fd-4150-9184-60f099206694",
      symbol: "stkcvxcrvUSDUSDC",
    },
    "0x5C5e5117E26374870c80a5FA04c3f75a821440D6": {
      id: "a3ffd3fe-b21c-44eb-94d5-22c80057a600",
      symbol: "stkcvxcrvUSDUSDT",
    },
    "0xEc5a52C685CC3Ad79a6a347aBACe330d69e0b1eD": {
      id: "05216992-5538-4c93-aecc-49398388464f",
      symbol: "PT_LBTC_27MAR2025",
    },
    "0x44A7876cA99460ef3218bf08b5f52E2dbE199566": {
      id: "eb7de368-b460-4638-bde1-50a129109b7b",
      symbol: "PT_corn_eBTC_27MAR2025",
    },
    "0xE00bd3Df25fb187d6ABBB620b3dfd19839947b81": {
      id: "6b28892f-0909-418d-b4bb-3106fff72449",
      symbol: "PT_sUSDe_27MAR2025",
    },
    "0x0655977FEb2f289A4aB78af67BAB0d17aAb84367": {
      id: "5fd328af-4203-471b-bd16-1705c726d926",
      symbol: "scrvUSD",
    },
    "0x72eD19788Bce2971A5ed6401662230ee57e254B7": {
      id: "18d68b7b-1674-4616-b5a8-65bbfb3723cd",
      symbol: "stkcvxllamathena",
    },

    "0xb7de5dFCb74d25c2f21841fbd6230355C50d9308": {
      id: "606e53bf-ea88-4d4e-92b8-fcd6e97e4106",
      symbol: "PT_sUSDe_29MAY2025",
    },

    // "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497": {
    //   id: "66985a81-9c51-46ca-9977-42b4fe7bc6df",
    //   symbol: "sUSDe",
    // },
  },
  Optimism: {
    "0x9Bcef72be871e61ED4fBbc7630889beE758eb81D": {
      id: "d4b3c522-6127-4b89-bedf-83641cdcd2eb",
      symbol: "rETH",
    },
  },
  Arbitrum: {
    "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8": {
      id: "d4b3c522-6127-4b89-bedf-83641cdcd2eb",
      symbol: "rETH",
    },
    "0x1DEBd73E752bEaF79865Fd6446b0c970EaE7732f": {
      id: "0f45d730-b279-4629-8e11-ccb5cc3038b4",
      symbol: "cbETH",
    },
    "0x95aB45875cFFdba1E5f451B950bC2E42c0053f39": {
      id: "77020688-e1f9-443c-9388-e51ace15cc32",
      symbol: "sfrxETH",
    },
  },
  Base: {},
  Sonic: {},
};
