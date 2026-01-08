import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { DETH?: Address }> = {
  Mainnet: { DETH: "0x871ab8e36cae9af35c6a3488b049965233deb7ed" },
};

export const PROTOCOL = "Makina";
