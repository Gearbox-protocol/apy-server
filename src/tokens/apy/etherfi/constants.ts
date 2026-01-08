import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { weETH?: Address }> = {
  Mainnet: {
    weETH: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
  },
  Arbitrum: {
    weETH: "0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe",
  },
};

export const PROTOCOL = "etherfi";
