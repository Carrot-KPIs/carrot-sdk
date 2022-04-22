import FACTORY_ABI from '../abis/factory.json'
import REALITY_ABI from '../abis/reality.json'
import KPI_TOKEN_ABI from '../abis/kpi-token.json'
import { ChainId } from '@carrot-kpi/sdk-core'

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x0000000000000000000000000000000000000000',
  [ChainId.RINKEBY]: '0x6752241ee8420cb61A6ae6B666bD5759BFAC6eb0',
  [ChainId.GNOSIS]: '0xe82c4D8b993D613a28600B953e91A3A93Ae69Fd6',
}

export const REALITY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x325a2e0F3CCA2ddbaeBB4DfC38Df8D19ca165b47',
  [ChainId.RINKEBY]: '0x3D00D77ee771405628a4bA4913175EcC095538da',
  [ChainId.GNOSIS]: '0x79e32aE03fb27B07C89c0c568F80287C01ca2E57',
}

export { FACTORY_ABI, REALITY_ABI, KPI_TOKEN_ABI }
