import FACTORY_ABI from './abis/factory.json'
import ERC20_ABI from './abis/erc20.json'
import REALITY_ABI from './abis/reality.json'
import KPI_TOKEN_ABI from './abis/kpi-token.json'
import MULTICALL_ABI from './abis/multicall.json'

export enum ChainId {
  RINKEBY = 4,
}

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.RINKEBY]: '0x6752241ee8420cb61A6ae6B666bD5759BFAC6eb0',
}

export const REALITY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.RINKEBY]: '0x3D00D77ee771405628a4bA4913175EcC095538da',
}

export const MULTICALL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.RINKEBY]: '0x42ad527de7d4e9d9d011ac45b31d8551f8fe9821',
}

export { FACTORY_ABI, REALITY_ABI, ERC20_ABI, KPI_TOKEN_ABI, MULTICALL_ABI }
