import FACTORY_ABI from './abis/factory.json'
import ERC20_ABI from './abis/erc20.json'
import REALITY_ABI from './abis/reality.json'
import KPI_TOKEN_ABI from './abis/kpi-token.json'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export enum ChainId {
  MAINNET = 1,
  RINKEBY = 4,
}

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ADDRESS,
  [ChainId.RINKEBY]: '0xa60c831dc30A6564Aa23044Ade594C2f1e3c9929',
}

export const REALITY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x325a2e0F3CCA2ddbaeBB4DfC38Df8D19ca165b47',
  [ChainId.RINKEBY]: '0x3D00D77ee771405628a4bA4913175EcC095538da',
}

export { FACTORY_ABI, REALITY_ABI, ERC20_ABI, KPI_TOKEN_ABI }
