import type { Address } from "viem";

import type { NetworkType } from "../../../core/chains";
import type { PartialRecord } from "../../../core/utils";

export const PROTOCOL = "pendle";

export interface PendleResponse {
  underlyingApy: number;
  underlyingInterestApy: number;
  impliedApy: number;
  aggregatedApy: number;
}

export const TOKENS: PartialRecord<
  NetworkType,
  Record<
    Address,
    {
      id: Address;
      symbol: string;
      field: keyof PendleResponse;
      chainId: number;
    }
  > // symbol to pool
> = {
  Mainnet: {
    "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497": {
      id: "0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce",
      symbol: "sUSDe",
      field: "underlyingInterestApy",
      chainId: 1,
    },
  },
  Plasma: {
    "0x211cc4dd073734da055fbf44a2b4667d5e5fe5d2": {
      id: "0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce",
      symbol: "sUSDe",
      field: "underlyingInterestApy",
      chainId: 1,
    },

    "0x0b2b2b2076d95dda7817e785989fe353fe955ef9": {
      id: "0x43023675c804a759cbf900da83dbcc97ee2afbe7",
      symbol: "sUSDai",
      field: "underlyingApy",
      chainId: 42161,
    },

    "0x93b544c330f60a2aa05ced87aeeffb8d38fd8c9a": {
      id: "0xfd3eb62302fa3cbc3c7e59e887b92dbbc814285d",
      symbol: "PT-USDe-15JAN2026",
      field: "impliedApy",
      chainId: 9745,
    },
    "0x02fcc4989b4c9d435b7ced3fe1ba4cf77bbb5dd8": {
      id: "0xe06c3b972ba630ccf3392cecdbe070690b4e6b55",
      symbol: "PT-sUSDe-15JAN2026",
      field: "impliedApy",
      chainId: 9745,
    },
    "0x8dfb9a39dfab16bffe77f15544b5bf03e377e419": {
      id: "0x18d89b23d2875590c502cd3eac8f448f3ccf9999",
      symbol: "PT-syrupUSDT-29JAN2026",
      field: "impliedApy",
      chainId: 9745,
    },
    "0xd516188daf64efa04a8d60872f891f2cc811a561": {
      id: "0x15735f2f53c5cd25a57dff83b11c93eceaf72073",
      symbol: "PT-USDai-19MAR2026",
      field: "impliedApy",
      chainId: 9745,
    },
    "0xedac81b27790e0728f54dea3b7718e5437e85353": {
      id: "0x0d7d9abee602c7f0a242ea7e200e47c372acba84",
      symbol: "PT-sUSDai-19MAR2026",
      field: "impliedApy",
      chainId: 9745,
    },

    "0x18d89b23d2875590c502cd3eac8f448f3ccf9999": {
      id: "0x18d89b23d2875590c502cd3eac8f448f3ccf9999",
      symbol: "LP-syrupUSDT-29JAN2026",
      field: "aggregatedApy",
      chainId: 9745,
    },
  },
};
