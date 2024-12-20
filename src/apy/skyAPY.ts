import {
  NetworkType,
  PartialRecord,
  PERCENTAGE_DECIMALS,
  PERCENTAGE_FACTOR,
  SupportedToken,
  tokenDataByNetwork,
} from "@gearbox-protocol/sdk-gov";
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


export async function getSkyAPY(network: NetworkType): Promise<APYResult> {
  if (network != "Mainnet") {
    return {};
  }
  try {
    const resp = await axios.get<APYResponse>(getAPYURL());
    const apyInfo = resp?.data?.[0];

    const savingsRate = apyInfo?.sky_savings_rate_apy || 0;
    const farmRate = apyInfo?.sky_farm_apy || 0;
    let currentTokens = tokenDataByNetwork[network];
    let sUSDS = currentTokens?.["sUSDS"];
    let stkUSDS = currentTokens?.["stkUSDS"];
    let response: APYResult = {};
    response[sUSDS] = getTokenAPY("sUSDS", [{
      reward: sUSDS,
      symbol: "sUSDS",
      value: numberToAPY(Number(savingsRate)),
    }]);

    response[stkUSDS] = getTokenAPY("stkUSDS", [{
      reward: stkUSDS,
      symbol: "stkUSDS",
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
