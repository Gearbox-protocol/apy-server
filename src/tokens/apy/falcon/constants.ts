import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { sUSDf?: Address }> = {
  Mainnet: {
    sUSDf: "0xc8CF6D7991f15525488b2A83Df53468D682Ba4B0",
  },
};

export const PROTOCOL = "falcon";
