import { PartialRecord, PERCENTAGE_FACTOR, tokenDataByNetwork, NetworkType, NOT_DEPLOYED } from "@gearbox-protocol/sdk-gov";
import axios from "axios";
import { Address } from "viem";
import { APYResult, getTokenAPY } from "./type";

import { TokensWithAPY } from ".";

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

export type LidoAPYResult = PartialRecord<
  Extract<TokensWithAPY, "STETH" | "wstETH">,
  number
>;

export async function getLidoAPY(network: NetworkType): Promise<APYResult> {
  const res = await axios.get<LidoApyResponse>(LIDO_URL);
  const { smaApr = 0 } = res?.data?.data || {};

  const r = Math.round(smaApr * Number(PERCENTAGE_FACTOR));

  const currentTokens = tokenDataByNetwork[network];

  let result: APYResult = {};
  let STETH = currentTokens?.["STETH"];
  if (STETH != NOT_DEPLOYED) {
    result[STETH] = getTokenAPY("STETH", [{
      reward: STETH,
      symbol: "STETH",
      value: smaApr,
    }]);
  }
  let wstETH = currentTokens?.["wstETH"];
  if (wstETH != NOT_DEPLOYED) {
    result[wstETH] = getTokenAPY("wstETH",
      [{
        reward: wstETH,
        symbol: "wstETH",
        value: smaApr,
      }]);
  }
  return result;
}
