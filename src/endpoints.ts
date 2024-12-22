import { ApyDetails } from './apy';
import {
    isSupportedNetwork,
} from "@gearbox-protocol/sdk-gov";
import { Address, isAddress } from 'viem';
import { Fetcher } from './fetcher';

interface Response {
    status: string,
    description?: string,
    data?: OutputDetails[] | OutputDetails
}

interface OutputDetails {
    chainId: number,
    address: string,
    symbol: string,
    rewards: {
        apy: ApyDetails[],
    }
}


export async function getByChainAndToken(req: any, res: any, fetcher: Fetcher) {
    let [isChainIdValid, chainId] = checkChainId(req.params.chainId);
    if (!checkResp(isChainIdValid, res)) {
        return;
    }
    let [isTokenValid, tokenAddress] = checkTokenAddress(req.params.tokenAddress);
    if (!checkResp(isTokenValid, res)) {
        return;
    }
    let data: OutputDetails = {
        chainId: chainId,
        address: tokenAddress.toLowerCase(),
        symbol: "",
        rewards: {
            apy: [],
        }
    };
    Object.entries(fetcher.cache[chainId]).forEach(([key, apys]) => {
        if (key == tokenAddress) {
            data.rewards.apy = apys.apys;
            data.symbol = apys.symbol;
        }
    })
    res.set({ 'Content-Type': 'application/json' });
    res.send(JSON.stringify({ data: data, status: "ok" } as Response));
    //
}

export async function getAll(req: any, res: any, fetcher: Fetcher) {
    let [isChainIdValid, chainId] = checkChainId(req.query.chain_id);
    if (!checkResp(isChainIdValid, res)) {
        return;
    }
    let data: OutputDetails[] = [];
    Object.entries(fetcher.cache).forEach(([key, apys]) => {
        if (chainId == 0 || +key == chainId) {
            for (const [token, apy] of Object.entries(apys)) {
                data.push({
                    chainId: +key,
                    address: token,
                    symbol: apy.symbol,
                    rewards: {
                        apy: apy.apys,
                    }
                });
            }
        }
    })

    res.set({ 'Content-Type': 'application/json' });
    res.send(JSON.stringify({ data: data, status: "ok" } as Response));
}
export async function getRewardList(req: any, res: any, fetcher: Fetcher) {
    if (req.header('Content-Type') != "application/json") {
        checkResp({
            status: "error",
            description: "Unsupported Content-Type: use application/json",
        }, res);
    }
    let [isTokenList, tokenList] = checkTokenList(JSON.stringify(req.body));
    if (!checkResp(isTokenList, res)) {
        return;
    }

    let data: OutputDetails[] = [];
    for (var entry of tokenList) {
        let apys = fetcher.cache[entry.chain_id]?.[entry.token_address as Address];
        data.push({
            chainId: entry.chain_id,
            address: entry.token_address.toLowerCase(),
            symbol: apys.symbol,
            rewards: {
                apy: apys.apys,
            }
        });
    }

    res.set({ 'Content-Type': 'application/json' });
    res.send(JSON.stringify({ data: data, status: "ok" } as Response));
}

function checkChainId(data: any): [Response, number] {
    let notUndefined = data ?? "0";
    if (isNaN(Number(notUndefined))) {
        return [{
            status: "error",
            description: "Incorrect chain_id - must be integer"
        }, 0]
    }
    let chainId = +notUndefined;

    if (chainId != 0 && !isSupportedNetwork(chainId)) {
        return [{
            status: "error",
            description: `Unknown chain_id = ${chainId}`
        }, 0]
    }
    return [{ status: "ok" }, chainId];
}


function checkTokenAddress(data: any): [Response, string] {
    let notUndefined = data ?? "0x";
    if (!isAddress(notUndefined)) {
        return [{
            status: "error",
            description: `Invalid token_address: ${data}`
        }, ""]
    }
    return [{ status: "ok" }, (notUndefined as Address).toString()];
}

export function checkResp(res: Response, out: any): boolean {
    if (res.status == "error") {
        out.set({ 'Content-Type': 'application/json' });
        out.send(JSON.stringify(res));
        return false;
    }
    return true;
}
interface TokenRequest {
    token_ids: TokenList[]
}
interface TokenList {
    token_address: string,
    chain_id: number,
}
function checkTokenList(reqBody: string): [Response, TokenList[]] {
    let parsedBody: TokenRequest;
    // try {
    parsedBody = JSON.parse(reqBody);
    // } catch {
    //     return [{ status: "error", "description": "Invalid request body" }, []];
    // }

    let tokenList: TokenList[] = [];
    for (var entry of parsedBody.token_ids) {
        let [resp, chainId] = checkChainId(entry.chain_id.toString());
        if (resp.status == "error") {
            return [resp, []];
        }
        if (chainId == 0) {
            return [{
                status: "error",
                description: "Unknown chain_id",
            }, []];
        }
        let [respTokenAddr, tokenAddr] = checkTokenAddress(entry.token_address);
        if (respTokenAddr.status == "error") {
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