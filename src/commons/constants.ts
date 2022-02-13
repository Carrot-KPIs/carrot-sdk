import FACTORY_ABI from '../abis/factory.json'
import ERC20_ABI from '../abis/erc20.json'
import REALITY_ABI from '../abis/reality.json'
import KPI_TOKEN_ABI from '../abis/kpi-token.json'
import ORACLE_ABI from '../abis/oracle.json'
import KPI_TOKENS_MANAGER_ABI from '../abis/kpi-tokens-manager.json'
import ORACLES_MANAGER_ABI from '../abis/oracles-manager.json'
import PERMISSIVE_MULTICALL_ABI from '../abis/permissive-multicall.json'

const INFURA_PROJECT_ID = '0ebf4dd05d6740f482938b8a80860d13'
const POCKET_ID = '61d8970ca065f5003a112e86'

export const IPFS_GATEWAY = 'https://infura-ipfs.io/ipfs/'

export enum ChainId {
  MAINNET = 1,
  RINKEBY = 4,
  XDAI = 100,
}

export const RPC_URL: { [chainId: number]: string } = {
  [ChainId.MAINNET]: `https://eth-mainnet.gateway.pokt.network/v1/lb/${POCKET_ID}`,
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  [ChainId.XDAI]: `https://poa-xdai.gateway.pokt.network/v1/lb/${POCKET_ID}`,
}

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0000000000000000000000000000000000000000',
  [ChainId.RINKEBY]: '0x2DbbdFB250a35e54908b2BB4ef85ffbaCBCa796E',
  [ChainId.XDAI]: '0x0000000000000000000000000000000000000000',
}

export const KPI_TOKENS_MANAGER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0000000000000000000000000000000000000000',
  [ChainId.RINKEBY]: '0x786AD0d88306370c3710917c0788C872e96Bab3c',
  [ChainId.XDAI]: '0x0000000000000000000000000000000000000000',
}

export const ORACLES_MANAGER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0000000000000000000000000000000000000000',
  [ChainId.RINKEBY]: '0xCC29bF3825BC49E3C14C8466a0AfFeB0a83567bD',
  [ChainId.XDAI]: '0x0000000000000000000000000000000000000000',
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

export {
  FACTORY_ABI,
  REALITY_ABI,
  ERC20_ABI,
  KPI_TOKEN_ABI,
  ORACLE_ABI,
  PERMISSIVE_MULTICALL_ABI,
  KPI_TOKENS_MANAGER_ABI,
  ORACLES_MANAGER_ABI,
}
