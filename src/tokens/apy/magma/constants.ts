import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { gMON?: Address }> = {
  Monad: { gMON: "0x8498312A6B3CbD158bf0c93AbdCF29E6e4F55081" },
};

export const PROTOCOL = "magma";
