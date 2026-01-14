import type { NetworkType } from "@gearbox-protocol/sdk";
import type { Address } from "viem";
import type { PartialRecord } from "../../../core/utils";

export const TOKENS: PartialRecord<
  NetworkType,
  { wstUSR?: Address; RLP?: Address }
> = {
  Mainnet: {
    wstUSR: "0x1202F5C7b4B9E47a1A484E8B270be34dbbC75055",
    RLP: "0x4956b52aE2fF65D74CA2d61207523288e4528f96",
  },
};

export const PROTOCOL = "resolv";
