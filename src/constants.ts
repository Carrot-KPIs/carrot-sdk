import FACTORY_ABI from './abis/factory.json'
import ERC20_ABI from './abis/erc20.json'
import REALITY_ABI from './abis/reality.json'
import KPI_TOKEN_ABI from './abis/kpi-token.json'
import PERMISSIVE_MULTICALL_ABI from './abis/permissive-multicall.json'

export enum ChainId {
  MAINNET = 1,
  RINKEBY = 4,
  XDAI = 100,
}

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0000000000000000000000000000000000000000',
  [ChainId.RINKEBY]: '0x6752241ee8420cb61A6ae6B666bD5759BFAC6eb0',
  [ChainId.XDAI]: '0xe82c4D8b993D613a28600B953e91A3A93Ae69Fd6',
}

export const REALITY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x325a2e0F3CCA2ddbaeBB4DfC38Df8D19ca165b47',
  [ChainId.RINKEBY]: '0x3D00D77ee771405628a4bA4913175EcC095538da',
  [ChainId.XDAI]: '0x79e32aE03fb27B07C89c0c568F80287C01ca2E57',
}

export const PERMISSIVE_MULTICALL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0946f567d0ed891e6566c1da8e5093517f43571d',
  [ChainId.RINKEBY]: '0x798d8ced4dff8f054a5153762187e84751a73344',
  [ChainId.XDAI]: '0x4E75068ED2338fCa56631E740B0723A6dbc1d5CD',
}

export { FACTORY_ABI, REALITY_ABI, ERC20_ABI, KPI_TOKEN_ABI, PERMISSIVE_MULTICALL_ABI }
