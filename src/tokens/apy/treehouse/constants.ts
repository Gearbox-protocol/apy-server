import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { tETH?: Address }> = {
  Mainnet: {
    tETH: "0xD11c452fc99cF405034ee446803b6F6c1F6d5ED8",
  },
};

export const PROTOCOL = "treehouse";
