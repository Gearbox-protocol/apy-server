import { cachedAxios } from "../../../core/app";
import type { APYHandler, APYResult } from "../constants";
import { fetchLidoData } from "../lido";
import { PROTOCOL, TOKENS } from "./constants";

interface Response {
  obol: number;
  ssv: number;
}

const getUrl = () => "https://points.mellow.finance/dvv/apr";

const getAPYMellow: APYHandler = async network => {
  const tokens = TOKENS[network];
  const tokenEntries = Object.entries(tokens).map(
    ([k, v]) => [k.toLowerCase(), v] as const,
  );
  if (tokenEntries.length === 0) return {};

  const { smaApr } = await fetchLidoData();
  const { data } = await cachedAxios.get<Response>(getUrl());

  const obolRate = data?.obol || 0;
  const ssvRate = data?.ssv || 0;

  const result: APYResult = {};

  if (tokens?.DVstETH) {
    console.log("DVstETH", smaApr, obolRate, ssvRate);

    result[tokens.DVstETH] = {
      address: tokens.DVstETH,
      symbol: "DVstETH",

      apys: [
        {
          address: tokens.DVstETH,
          symbol: "DVstETH",
          protocol: PROTOCOL,
          value: smaApr + obolRate + ssvRate,
        },
      ],
    };
  }

  return result;
};

export { getAPYMellow };
