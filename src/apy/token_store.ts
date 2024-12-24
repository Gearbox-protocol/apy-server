import { NetworkType, NOT_DEPLOYED } from "./type";
import { Address } from "viem";

interface Token {
    symbol: string,
    address: Address,
}
export class TokenStore {
    data: Record<NetworkType, Record<Address, string>>

    constructor() {
        this.data = {
            "Mainnet": {
                // for sky
                "0xa3931d71877C0E7a3148CB7Eb4463524FEc27fbD": "sUSDS",
                "0xcB5D10A57Aeb622b92784D53F730eE2210ab370E": "stkUSDS",
                // for pendle
                "0x808507121B80c02388fAd14726482e061B8da827": "PENDLE",
                //
                '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0': 'wstETH',
                '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84': 'STETH',
                // for defillama
                "0x83F20F44975D03b1b09e64809B757c47f942BEeA": "sDAI",
                "0xae78736Cd615f374D3085123A210448E74Fc6393": "rETH",
                "0xf1C9acDc66974dFB6dEcB12aA385b9cD01190E38": "osETH",
                "0xDd1fE5AD401D4777cE89959b7fa587e569Bf125D": "auraB_rETH_STABLE_vault",
                "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497": "sUSDe",
                "0x276187f24D41745513cbE2Bd5dFC33a4d8CDc9ed": "stkcvxcrvFRAX",
                "0x0Bf1626d4925F8A872801968be11c052862AC2D3": "stkcvxcrvUSDETHCRV",
                "0x7376AD488AB2bd8dF7665d619A4148f0E5094813": "stkcvxcrvUSDFRAX",
                "0xEE3EE8373384BBfea3227E527C1B9b4e7821273E": "stkcvxcrvUSDTWBTCWETH",
                "0xDb4217B9C8DB788Aa3871d45B4BE6ac5D1FF8C49": "stkcvxcrvUSDUSDC",
                "0x5C5e5117E26374870c80a5FA04c3f75a821440D6": "stkcvxcrvUSDUSDT",
                "0xEe9085fC268F6727d5D4293dBABccF901ffDCC29": "PT_sUSDe_26DEC2024",
                "0xf7906F274c174A52d444175729E3fa98f9bde285": "PT_ezETH_26DEC2024",
                "0x6ee2b5E19ECBa773a352E5B21415Dc419A700d1d": "PT_eETH_26DEC2024",
                "0xEc5a52C685CC3Ad79a6a347aBACe330d69e0b1eD": "PT_LBTC_27MAR2025",
                "0xB997B3418935A1Df0F914Ee901ec83927c1509A0": "PT_eBTC_26DEC2024",
                "0x332A8ee60EdFf0a11CF3994b1b846BBC27d3DcD6": "PT_cornLBTC_26DEC2024",
                "0x44A7876cA99460ef3218bf08b5f52E2dbE199566": "PT_corn_eBTC_27MAR2025",
                "0xa76f0C6e5f286bFF151b891d2A0245077F1Ad74c": "PT_corn_pumpBTC_26DEC2024",
                "0xE00bd3Df25fb187d6ABBB620b3dfd19839947b81": "PT_sUSDe_27MAR2025",
                //
                '0xD533a949740bb3306d119CC777fa900bA034cd52': 'CRV',

            },
            "Optimism": {
                "0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb": "wstETH",
                //
                "0x9Bcef72be871e61ED4fBbc7630889beE758eb81D": "rETH",
                //
                '0x0994206dfE8De6Ec6920FF4D779B0d950605Fb53': 'CRV',
            },
            "Arbitrum": {
                "0x5979D7b546E38E414F7E9822514be443A4800529": "wstETH",
                //
                "0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8": "rETH",
                '0x1DEBd73E752bEaF79865Fd6446b0c970EaE7732f': "cbETH",
                '0x95aB45875cFFdba1E5f451B950bC2E42c0053f39': "sfrxETH",
                //
                '0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978': 'CRV',
            },
        }
    };

    getBysymbol(network: NetworkType, symNeeded: string): Token {
        for (var [addr, symbol] of Object.entries(this.data[network] || {})) {
            if (symbol == symNeeded) {
                return {
                    symbol: symbol,
                    address: addr as Address,
                };
            }
        }
        console.log(`error: token not found for ${network} ${symNeeded}`);
        return {
            symbol: symNeeded,
            address: NOT_DEPLOYED,
        };
    }
}