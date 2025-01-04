import axios from "axios";
import type { Address } from "viem";

import type { TokenStore } from "./token_store";
import type { APYResult, NetworkType } from "./type";
import { getTokenAPY, NOT_DEPLOYED } from "./type";

interface Apy {
  timeUnix: number;
  apr: number;
}

interface Meta {
  address: Address;
  chainId: number;
  symbol: string;
}

interface LidoApyResponse {
  data: {
    aprs: Array<Apy>;
    smaApr: number;
  };
  meta: Meta;
}

const LIDO_URL = "https://eth-api.lido.fi/v1/protocol/steth/apr/sma";

export async function getLidoAPY(
  network: NetworkType,
  store: TokenStore,
): Promise<APYResult> {
  const res = await axios.get<LidoApyResponse>(LIDO_URL);
  const { smaApr = 0 } = res?.data?.data || {};

  let result: APYResult = {};
  let STETH = store.getBysymbol(network, "STETH");
  let wstETH = store.getBysymbol(network, "wstETH");
  for (let token of [STETH, wstETH]) {
    if (token.address !== NOT_DEPLOYED) {
      result[token.address] = getTokenAPY(token.symbol, [
        {
          reward: token.address,
          symbol: token.symbol,
          value: smaApr,
        },
      ]);
    }
  }
  return result;
}
