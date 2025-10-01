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
    "0xB5528130B1d5D24aD172bF54CeeD062232AfbFBe": {
      id: "18d68b7b-1674-4616-b5a8-65bbfb3723cd",
      symbol: "stkcvxllamathena",
    },
    "0x444FA0ffb033265591895b66c81c2e5fF606E097": {
      id: "d826a92b-2bd2-4fae-8483-db1ef8888aee",
      symbol: "stkcvxRLUSDUSDC",
    },
    "0x87FA6c0296c986D1C901d72571282D57916B964a": {
      id: "d826a92b-2bd2-4fae-8483-db1ef8888aee",
      symbol: "stkcvxRLUSDUSDC",
    },

    "0xa327D7f665AFE9Ecb0963B5561C84C48C7EC71AB": {
      id: "977bc628-7476-43cf-abb8-68934bf56171",
      symbol: "stkcvxUSDCUSDf",
    },
    "0xeC3b5e45dD278d5AB9CDB31754B54DB314e9D52a": {
      id: "8d2a1154-094c-449e-bc5a-0e6bc418066c",
      symbol: "PT_USDf_29JAN2026",
    },

    "0x4274cD7277C7bb0806Bd5FE84b9aDAE466a8DA0a": {
      id: "f91b2168-c279-475c-a98a-673220f4fee7",
      symbol: "aegis-yusd",
    },
    "0x19Ebd191f7A24ECE672ba13A302212b5eF7F35cb": {
      id: "7c43e890-cefc-48d1-bf80-203cdb7dfe4f",
      symbol: "yieldfi-yusd",
    },
    "0xf580CF6B26251541f323bbda1f31CC8F91a0cA78": {
      id: "909f237f-00f1-495f-83de-8321caa9c49b",
      symbol: "PT-yUSD-27NOV2025",
    },
    "0x40fC1F58Ab6Efc06E008370a040e92b635dD4cE4": {
      id: "156c505a-8bc3-46c8-89d1-8f4f8a58088b",
      symbol: "stkcvxfrxUSDUSDf",
    },
    "0xf3f491e5608f8b8a6fd9e9d66a4a4036d7fd282c": {
      id: "bc3a324a-7da5-4138-a4a5-b8d51fec1612",
      symbol: "PT-pUSDe-16OCT2025",
    },

    "0x48e502fbb6ff2cc687d049150e2c8addc765a43a": {
      id: "d0d0021e-5e1c-4ef3-88b7-9084d78e4d82",
      symbol: "PT_sUSDf_29JAN2026",
    },

    "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0": {
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "wstETH",
    },
    "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84": {
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "STETH",
    },
    "0x84631c0d0081FDe56DeB72F6DE77abBbF6A9f93a": {
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "Re7LRT",
    },
    "0xB908c9FE885369643adB5FBA4407d52bD726c72d": {
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "cp0xLRT",
    },
    "0x7a4EffD87C2f3C55CA251080b1343b605f327E3a": {
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "rstETH",
    },
    "0xBEEF69Ac7870777598A04B2bd4771c71212E6aBc": {
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "steakLRT",
    },
    "0x5fD13359Ba15A84B76f7F87568309040176167cd": {
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "amphrETH",
    },

    "0xbe9895146f7af43049ca1c1ae358b0541ea49704": {
      id: "0f45d730-b279-4629-8e11-ccb5cc3038b4",
      symbol: "cbETH",
    },
  },
  Optimism: {
    "0x9Bcef72be871e61ED4fBbc7630889beE758eb81D": {
      id: "d4b3c522-6127-4b89-bedf-83641cdcd2eb",
      symbol: "rETH",
    },

    "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb": {
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "wstETH",
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
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "sfrxETH",
    },

    "0x5979D7b546E38E414F7E9822514be443A4800529": {
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "wstETH",
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
  },
  Lisk: {
    "0x76D8de471F54aAA87784119c60Df1bbFc852C415": {
      id: "747c1d2a-c668-4682-b9f9-296708a3dd90",
      symbol: "wstETH",
    },
  },
  Plasma: {
    "0x6eaf19b2fc24552925db245f9ff613157a7dbb4c": {
      id: "b7daea94-6378-4eeb-8d10-52beebadf77b",
      symbol: "xUSD",
    },
    "0xc4374775489cb9c56003bf2c9b12495fc64f0771": {
      id: "8edfdf02-cdbb-43f7-bca6-954e5fe56813",
      symbol: "syrupUSDT",
    },
  },
};
