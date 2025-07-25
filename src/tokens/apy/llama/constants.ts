import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const PROTOCOL = "llama";

export const TOKENS: PartialRecord<
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
    "0x0655977FEb2f289A4aB78af67BAB0d17aAb84367": {
      id: "5fd328af-4203-471b-bd16-1705c726d926",
      symbol: "scrvUSD",
    },

    "0x72eD19788Bce2971A5ed6401662230ee57e254B7": {
      id: "18d68b7b-1674-4616-b5a8-65bbfb3723cd",
      symbol: "stkcvxllamathena",
    },
    "0x444FA0ffb033265591895b66c81c2e5fF606E097": {
      id: "d826a92b-2bd2-4fae-8483-db1ef8888aee",
      symbol: "stkcvxRLUSDUSDC",
    },
    "0x7c853d6bfb49256af65af672dcc3f66c015e96e0": {
      id: "2f17b2cf-9f50-41de-95f9-502079c789de",
      symbol: "PT_uptBTC_14AUG2025",
    },

    "0xa327D7f665AFE9Ecb0963B5561C84C48C7EC71AB": {
      id: "977bc628-7476-43cf-abb8-68934bf56171",
      symbol: "stkcvxUSDCUSDf",
    },
    "0xAB365C0879024481E4ad3b47bd6FeA9c10014FbC": {
      id: "72fc3af9-cdce-4cc6-9221-68b21726124c",
      symbol: "PT_sUSDf_25SEP2025",
    },
    "0xeC3b5e45dD278d5AB9CDB31754B54DB314e9D52a": {
      id: "8d2a1154-094c-449e-bc5a-0e6bc418066c",
      symbol: "PT_USDf_29JAN2026",
    },

    // "0x276187f24D41745513cbE2Bd5dFC33a4d8CDc9ed": {
    //   id: "bd072651-d99c-4154-aeae-51f12109c054",
    //   symbol: "stkcvxcrvFRAX",
    // },
    // "0x0Bf1626d4925F8A872801968be11c052862AC2D3": {
    //   id: "654ac683-141b-42d3-b28d-b2f77eedd595",
    //   symbol: "stkcvxcrvUSDETHCRV",
    // },
    // "0x7376AD488AB2bd8dF7665d619A4148f0E5094813": {
    //   id: "411af006-56b0-480a-9586-1071bccbd178",
    //   symbol: "stkcvxcrvUSDFRAX",
    // },
    // "0xEE3EE8373384BBfea3227E527C1B9b4e7821273E": {
    //   id: "3be97c90-d4a8-42b3-a0d0-2906ae4e9d27",
    //   symbol: "stkcvxcrvUSDTWBTCWETH",
    // },
    // "0xDb4217B9C8DB788Aa3871d45B4BE6ac5D1FF8C49": {
    //   id: "755fcec6-f4fd-4150-9184-60f099206694",
    //   symbol: "stkcvxcrvUSDUSDC",
    // },
    // "0x5C5e5117E26374870c80a5FA04c3f75a821440D6": {
    //   id: "a3ffd3fe-b21c-44eb-94d5-22c80057a600",
    //   symbol: "stkcvxcrvUSDUSDT",
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
  BNB: {
    "0x32C830f5c34122C6afB8aE87ABA541B7900a2C5F": {
      id: "89818a06-3414-4d9d-a8a6-7c8686a40d2a",
      symbol: "ynBNBx",
    },
    "0x7788A3538C5fc7F9c7C8A74EAC4c898fC8d87d92": {
      id: "e7ac1a5f-f141-4c00-9a5d-2e2c505a800c",
      symbol: "sUSDX",
    },
    "0xfA56005cdf111725A8e5395fc90Cd33135BcCAE8": {
      id: "b0922876-0529-4541-869d-eee2a38c0867",
      symbol: "PT_sUSDX_1SEP2025",
    },
  },
};
