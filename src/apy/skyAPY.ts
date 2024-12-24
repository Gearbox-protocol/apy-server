import {
  NetworkType,
  PERCENTAGE_DECIMALS,
} from "./type";
import { TokenStore } from "./token_store";
import { APYResult, getTokenAPY } from "./type";
import axios from "axios";

type APYResponse = [
  {
    sky_savings_rate_apy: string;
    sky_farm_apy: string;
  },
];

const getAPYURL = () => "https://info-sky.blockanalitica.com/api/v1/overall/";

// type SkyTokens = Extract<SupportedToken, "sUSDS" | "stkUSDS">;


export async function getSkyAPY(network: NetworkType, store: TokenStore): Promise<APYResult> {
  if (network != "Mainnet") {
    return {};
  }
  try {
    const resp = await axios.get<APYResponse>(getAPYURL());
    const apyInfo = resp?.data?.[0];

    const savingsRate = apyInfo?.sky_savings_rate_apy || 0;
    const farmRate = apyInfo?.sky_farm_apy || 0;
    let sUSDS = store.getBysymbol(network, "sUSDS");
    let stkUSDS = store.getBysymbol(network, "stkUSDS");
    let response: APYResult = {};
    //
    response[sUSDS.address] = getTokenAPY(sUSDS.symbol, [{
      reward: sUSDS.address,
      symbol: sUSDS.symbol,
      value: numberToAPY(Number(savingsRate)),
    }]);
    //
    response[stkUSDS.address] = getTokenAPY(stkUSDS.symbol, [{
      reward: stkUSDS.address,
      symbol: stkUSDS.symbol,
      value: numberToAPY(Number(farmRate)),
    }]);
    return response;
  } catch (e) {
    return {};
  }
}

function numberToAPY(baseApy: number) {
  return Math.round(
    baseApy * Number(PERCENTAGE_DECIMALS),
  );
}
