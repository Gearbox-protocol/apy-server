import {
  PartialRecord,
  PERCENTAGE_DECIMALS,
  PERCENTAGE_FACTOR,
  SupportedToken,
  NetworkType,
  tokenDataByNetwork,
} from "@gearbox-protocol/sdk-gov";
import axios from "axios";
import { APYResult } from "./type";

interface APYResponse {
  underlyingInterestApy: number;
}

const getAPYURL = () =>
  "https://api-v2.pendle.finance/core/v2/1/markets/0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce/data";


export async function getPendleAPY(network: NetworkType): Promise<APYResult> {
  if (network != "Mainnet") {
    return {};
  }
  try {
    const resp = await axios.get<APYResponse>(getAPYURL());
    const apyInfo = resp?.data;

    const rate = apyInfo?.underlyingInterestApy || 0;

    let result: APYResult = {};
    let currentTokens = tokenDataByNetwork[network];
    let pendle = currentTokens?.["PENDLE"];

    result[pendle] = {
      symbol: "PENDLE",
      apys: [{
        value: numberToAPY(Number(rate)),
        reward: pendle,
        symbol: "PENDLE",
      }]
    };
    //
    return result;
  } catch (e) {
    return {};
  }
}

function numberToAPY(baseApy: number) {
  return baseApy * Number(PERCENTAGE_DECIMALS);
}
