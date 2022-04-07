import FACTORY_ABI from '../abis/factory.json'
import REALITY_ABI from '../abis/reality.json'
import KPI_TOKEN_ABI from '../abis/kpi-token.json'
import ORACLE_ABI from '../abis/oracle.json'
import KPI_TOKENS_MANAGER_ABI from '../abis/kpi-tokens-manager.json'
import ORACLES_MANAGER_ABI from '../abis/oracles-manager.json'
import { POCKET_ID, INFURA_PROJECT_ID, ChainId, PERMISSIVE_MULTICALL_ABI, ERC20_ABI } from '@carrot-kpi/sdk-core'

export const RPC_URL: { [chainId: number]: string } = {
  [ChainId.MAINNET]: `https://eth-mainnet.gateway.pokt.network/v1/lb/${POCKET_ID}`,
  [ChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  [ChainId.GNOSIS]: `https://poa-xdai.gateway.pokt.network/v1/lb/${POCKET_ID}`,
}

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0000000000000000000000000000000000000000',
  [ChainId.RINKEBY]: '0xa5678aFDd95BF4b2BF3510CD8E774d224e83639C',
  [ChainId.GNOSIS]: '0x0000000000000000000000000000000000000000',
}

export const KPI_TOKENS_MANAGER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0000000000000000000000000000000000000000',
  [ChainId.RINKEBY]: '0x04ED5Fa06142D37692fa74B2662dd222fA2Ea163',
  [ChainId.GNOSIS]: '0x0000000000000000000000000000000000000000',
}

export const ORACLES_MANAGER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0000000000000000000000000000000000000000',
  [ChainId.RINKEBY]: '0xc335c0a4C0163d19327EbbFaBA90253575E6DD76',
  [ChainId.GNOSIS]: '0x0000000000000000000000000000000000000000',
}

export const REALITY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x325a2e0F3CCA2ddbaeBB4DfC38Df8D19ca165b47',
  [ChainId.RINKEBY]: '0x3D00D77ee771405628a4bA4913175EcC095538da',
  [ChainId.GNOSIS]: '0x79e32aE03fb27B07C89c0c568F80287C01ca2E57',
}

export const PERMISSIVE_MULTICALL_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0946f567d0ed891e6566c1da8e5093517f43571d',
  [ChainId.RINKEBY]: '0x798d8ced4dff8f054a5153762187e84751a73344',
  [ChainId.GNOSIS]: '0x4E75068ED2338fCa56631E740B0723A6dbc1d5CD',
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
