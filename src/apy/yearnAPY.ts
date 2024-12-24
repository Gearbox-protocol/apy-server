import {
  CHAINS,
  NetworkType,
  PERCENTAGE_DECIMALS,
} from './type';

import axios from "axios";
import { Address } from "viem";
import { APYResult, getTokenAPY } from "./type";

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


const yearnTokens = ["yvDAI", "yvUSDC", "yvUSDC_e", "yvWETH", "yvWBTC", "yvUSDT", "yvOP", "yvCurve-stETH", "yvCurve-FRAX"];

export async function getYearnAPY(
  network: NetworkType,
): Promise<APYResult> {
  try {
    const chainId = CHAINS[network];

    const { data } = await axios.get<Response>(getUrl(chainId));

    const dataByAddress = data.reduce<Record<string, YearnAPYData>>(
      (acc, d) => {
        acc[d.symbol.toLowerCase()] = d;
        return acc;
      },
      {},
    );

    const yearnAPY = yearnTokens.reduce<APYResult>((acc, yearnSymbol) => {

      const data = dataByAddress[yearnSymbol.toLowerCase()];
      if (!data) {
        return acc;
      }
      const { apr: apy } = data || {};
      const { netAPR } = apy || {};
      const netApy = netAPR || 0;

      acc[data.address as Address] = getTokenAPY(yearnSymbol, [{
        reward: data.address as Address,
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
