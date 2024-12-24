import {
  APYResult, PERCENTAGE_DECIMALS,
  NetworkType,
} from "./type";
import axios from "axios";
import { TokenStore } from "./token_store";
interface APYResponse {
  underlyingInterestApy: number;
}

const getAPYURL = () =>
  "https://api-v2.pendle.finance/core/v2/1/markets/0xcdd26eb5eb2ce0f203a84553853667ae69ca29ce/data";


export async function getPendleAPY(network: NetworkType, store: TokenStore): Promise<APYResult> {
  if (network != "Mainnet") {
    return {};
  }
  try {
    const resp = await axios.get<APYResponse>(getAPYURL());
    const apyInfo = resp?.data;

    const rate = apyInfo?.underlyingInterestApy || 0;

    let result: APYResult = {};
    let pendle = store.getBysymbol(network, "PENDLE");

    result[pendle.address] = {
      symbol: pendle.symbol,
      apys: [{
        value: numberToAPY(Number(rate)),
        reward: pendle.address,
        symbol: pendle.symbol,
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
