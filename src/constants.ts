import FACTORY_ABI from './abis/factory.json'
import ERC20_ABI from './abis/erc20.json'
import REALITY_ABI from './abis/reality.json'
import KPI_TOKEN_ABI from './abis/kpi-token.json'
import MULTICALL_ABI from './abis/multicall.json'

export enum ChainId {
  RINKEBY = 4,
  XDAI = 100,
}

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.RINKEBY]: '0x6752241ee8420cb61A6ae6B666bD5759BFAC6eb0',
  [ChainId.XDAI]: '0xe82c4D8b993D613a28600B953e91A3A93Ae69Fd6',
}

export const REALITY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.RINKEBY]: '0x3D00D77ee771405628a4bA4913175EcC095538da',
  [ChainId.XDAI]: '0x79e32aE03fb27B07C89c0c568F80287C01ca2E57',
}

export const MULTICALL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.RINKEBY]: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
  [ChainId.XDAI]: '0xb5b692a88bdfc81ca69dcb1d924f59f0413a602a',
}

export { FACTORY_ABI, REALITY_ABI, ERC20_ABI, KPI_TOKEN_ABI, MULTICALL_ABI }
