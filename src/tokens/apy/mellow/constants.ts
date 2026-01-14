import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<NetworkType, { DVstETH?: Address }> = {
  Mainnet: {
    DVstETH: "0x5E362eb2c0706Bd1d134689eC75176018385430B",
  },
};

export const PROTOCOL = "mellow";
