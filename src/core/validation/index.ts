import { isAddress } from "viem";

import { isSupportedNetwork } from "../chains";
import type { Response } from "../response";
import { captureException } from "../sentry";
import { toJSONWithBigint } from "../utils";

export function checkChainId(data: any): [Response, number] {
  const notUndefined = data ?? "0";
  if (isNaN(Number(notUndefined))) {
    return [
      {
        status: "error",
        description: "Incorrect chain_id - must be integer",
      },
      0,
    ];
  }
  const chainId = Number(notUndefined);

  if (chainId !== 0 && !isSupportedNetwork(chainId)) {
    return [
      {
        status: "error",
        description: `Unknown chain_id = ${chainId}`,
      },
      0,
    ];
  }
  return [{ status: "ok" }, chainId];
}

export function checkTokenAddress(data: any): [Response, string] {
  const notUndefined = data ?? "0x";
  if (!isAddress(notUndefined)) {
    return [
      {
        status: "error",
        description: `Invalid token_address: ${data}`,
      },
      "",
    ];
  }
  return [{ status: "ok" }, notUndefined.toString()];
}

export function checkResp(res: Response, out: any): boolean {
  if (res.status === "error") {
    const r = toJSONWithBigint(res);
    out.set({ "Content-Type": "application/json" });
    out.send(toJSONWithBigint(r));

    captureException({ file: "endpoints/checkResp", error: r });
    console.error(`[SYSTEM] (CHECK RESPONSE): ${r}`);
    return false;
  }
  return true;
}

interface TokenRequest {
  token_ids: Array<TokenList>;
}
interface TokenList {
  token_address: string;
  chain_id: number;
}

export function checkTokenList(reqBody: string): [Response, Array<TokenList>] {
  let parsedBody: TokenRequest;

  parsedBody = JSON.parse(reqBody);

  const tokenList: Array<TokenList> = [];
  for (const entry of parsedBody.token_ids) {
    const [resp, chainId] = checkChainId(entry.chain_id.toString());
    if (resp.status === "error") {
      return [resp, []];
    }
    if (chainId === 0) {
      return [
        {
          status: "error",
          description: "Unknown chain_id",
        },
        [],
      ];
    }
    const [respTokenAddr, tokenAddr] = checkTokenAddress(entry.token_address);
    if (respTokenAddr.status === "error") {
      return [respTokenAddr, []];
    }
    //
    tokenList.push({
      token_address: tokenAddr,
      chain_id: chainId,
    });
  }
  return [{ status: "ok" }, tokenList];
}
