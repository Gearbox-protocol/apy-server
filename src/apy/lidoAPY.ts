import { NetworkType, NOT_DEPLOYED } from "./type";
import axios from "axios";
import { Address } from "viem";
import { APYResult, getTokenAPY } from "./type";
import { TokenStore } from "./token_store";

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


export async function getLidoAPY(network: NetworkType, store: TokenStore): Promise<APYResult> {
  const res = await axios.get<LidoApyResponse>(LIDO_URL);
  const { smaApr = 0 } = res?.data?.data || {};

  let result: APYResult = {};
  let STETH = store.getBysymbol(network, "STETH");
  let wstETH = store.getBysymbol(network, "wstETH");
  for (var token of [STETH, wstETH]) {
    if (token.address != NOT_DEPLOYED) {
      result[token.address] = getTokenAPY(token.symbol, [{
        reward: token.address,
        symbol: token.symbol,
        value: smaApr,
      }]);
    }
  }
  return result;
}
