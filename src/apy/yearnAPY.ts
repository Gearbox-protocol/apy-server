import {
  CHAINS,
  NetworkType,
  PartialRecord,
  PERCENTAGE_DECIMALS,
  PERCENTAGE_FACTOR,
  tokenDataByNetwork,
  TypedObjectUtils,
  YearnLPToken,
  yearnTokens,
} from "@gearbox-protocol/sdk-gov";
import axios from "axios";
import { Address } from "viem";
import { APYResult, ApyDetails, getTokenAPY } from "./type";

interface YearnAPYData {
  apr: {
    netAPR: number;
  };

  address: Address;
  symbol: string;
  display_name: string;
}

type Response = Array<YearnAPYData>;

const getUrl = (chainId: number) =>
  `https://ydaemon.yearn.finance/vaults/all?chainids=${chainId}&limit=2500`;

export type YearnAPYResult = PartialRecord<YearnLPToken, number>;

export async function getYearnAPY(
  network: NetworkType,
): Promise<APYResult> {
  try {
    const chainId = CHAINS[network];
    const currentTokens = tokenDataByNetwork[network];

    const { data } = await axios.get<Response>(getUrl(chainId));

    const dataByAddress = data.reduce<Record<string, YearnAPYData>>(
      (acc, d) => {
        acc[d.address.toLowerCase()] = d;
        return acc;
      },
      {},
    );

    const yearnAPY = TypedObjectUtils.entries(
      yearnTokens,
    ).reduce<APYResult>((acc, [yearnSymbol]) => {
      const address = (currentTokens?.[yearnSymbol] || "").toLowerCase();

      const data = dataByAddress[address];
      const { apr: apy } = data || {};
      const { netAPR } = apy || {};
      const netApy = netAPR || 0;

      acc[address as Address] = getTokenAPY(yearnSymbol, [{
        reward: address as Address,
        symbol: yearnSymbol,
        value: numberToAPY(netApy),
      }]);

      return acc;
    }, {});

    return yearnAPY;
  } catch (e) {
    return {};
  }
}

function numberToAPY(baseApy: number) {
  return baseApy * Number(PERCENTAGE_DECIMALS)
}
