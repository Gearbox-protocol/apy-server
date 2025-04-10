import type { Address } from "viem";

import type { NetworkType } from "../../utils";

export const GEAR_POOL =
  "0x5Be6C45e2d074fAa20700C49aDA3E88a1cc0025d".toLowerCase() as Address;

export const PROTOCOL = "curve";

export const TOKENS: Record<NetworkType, Record<Address, string>> = {
  Mainnet: {
    // CURVE LP TOKENS
    "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490": "3Crv",
    "0x3175Df0976dFA876431C2E9eE6Bc45b65d3473CC": "crvFRAX",
    "0x06325440D014e39736583c165C2963BA99fAf14E": "steCRV",
    "0xd632f22692FaC7611d2AA1C0D552930D43CAEd3B": "FRAX3CRV",
    "0xEd279fDD11cA84bEef15AF5D39BB4d4bEE23F0cA": "LUSD3CRV",
    "0xC25a3A3b969415c80451098fa907EC722572917F": "crvPlain3andSUSD",
    "0xD2967f45c4f384DEEa880F807Be904762a3DeA07": "gusd3CRV",
    "0x02950460E2b9529D0E00284A5fA2d7bDF3fA4d72": "USDeUSDC",
    "0x5dc1BF6f1e983C0b21EfB003c105133736fA0743": "FRAXUSDe",
    "0xF55B0f6F2Da5ffDDb104b58a60F2862745960442": "USDecrvUSD",
    "0xcE6431D21E3fb1036CE9973a3312368ED96F5CE7": "FRAXsDAI",
    "0x744793B5110f6ca9cC7CDfe1CE16677c3Eb192ef": "DOLAsUSDe",
    "0xE57180685E3348589E9521aa53Af0BCD497E884d": "DOLAFRAXBP3CRV_f",
    "0x8272E1A3dBef607C04AA6e5BD3a1A134c8ac063B": "crvUSDDOLA_f",
    "0xF36a4BA50C603204c3FC6d2dA8b78A7b69CBC67d": "USDeDAI",
    "0xEd4064f376cB8d68F770FB1Ff088a3d0F3FF5c4d": "crvCRVETH",
    "0x3A283D9c08E8b55966afb64C515f5143cf907611": "crvCVXETH",
    "0xf5f5B97624542D72A9E06f04804Bf81baA15e2B4": "crvUSDTWBTCWETH",
    "0xb79565c01b7Ae53618d9B847b9443aAf4f9011e7": "LDOETH",

    "0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E": "crvUSD",

    "0x4DEcE678ceceb27446b35C672dC7d61F30bAD69E": "crvUSDUSDC",
    "0x390f3595bCa2Df7d23783dFd126427CCeb997BF4": "crvUSDUSDT",
    "0x0CD6f267b2086bea681E922E19D40512511BE538": "crvUSDFRAX",
    "0x4eBdF703948ddCEA3B11f675B4D1Fba9d2414A14": "crvUSDETHCRV",
    "0x57064F49Ad7123C92560882a45518374ad982e85": "crvUsUSDe",
    "0xd29f8980852c2c76fC3f6E96a7Aa06E0BedCC1B1": "llamathena",

    "0x6c38cE8984a890F5e46e6dF6117C26b3F1EcfC9C": "rETH_f",
    "0x167478921b907422F8E88B43C4Af2B8BEa278d3A": "MtEthena",
    "0x670a72e6D22b0956C0D2573288F82DCc5d6E3a61": "GHOUSDe",
    "0xEEda34A377dD0ca676b9511EE1324974fA8d980D": "pufETHwstE",
    "0x635EF0056A597D13863B73825CcA297236578595": "GHOcrvUSD",
    "0x85dE3ADd465a219EE25E04d22c39aB027cF5C12E": "ezETHWETH",
    "0x8c65CeC3847ad99BdC02621bDBC89F2acE56934B": "ezpzETH",
    "0x2f3bC4c27A4437AeCA13dE0e37cdf1028f3706F0": "LBTCWBTC",
    "0x7704D01908afD31bf647d969c295BB45230cD2d6": "eBTCWBTC",
    "0xEA659B615b48EC6e2D55cD82FCBE5F43d79aeea0": "pumpBTCWBTC",
    "0xabaf76590478F2fE0b396996f55F0b61101e9502": "TriBTC",
  },
  Optimism: {
    "0x15F52286C0FF1d7A7dDbC9E300dd66628D46D4e6": "3CRV",
    "0xEfDE221f306152971D8e9f181bFe998447975810": "wstETHCRV",
  },
  Arbitrum: {
    "0x7f90122BF0700F9E7e1F688fe926940E8839F353": "2CRV",
    "0x82670f35306253222F8a165869B28c64739ac62e": "3c-crvUSD",
    "0x2FE7AE43591E534C256A1594D326e5779E302Ff4": "crvUSDFRAX",
    "0xec090cf6DD891D2d014beA6edAda6e05E025D93d": "crvUSDC",
    "0x73aF1150F265419Ef8a5DB41908B700C32D49135": "crvUSDT",
    "0x3aDf984c937FA6846E5a24E0A68521Bdaf767cE1": "crvUSDC_e",
    "0x1c34204FCFE5314Dcf53BE2671C02c35DB58B4e3": "USDEUSDC",
  },
  Base: {},
  Sonic: {},

  Monad: {},
  MegaETH: {},
  Berachain: {},
  Avalanche: {},
};
