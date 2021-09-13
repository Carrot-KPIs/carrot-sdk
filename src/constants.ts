import FACTORY_ABI from './abis/factory.json'
import ERC20_ABI from './abis/erc20.json'
import REALITY_ABI from './abis/reality.json'
import KPI_TOKEN_ABI from './abis/kpi-token.json'
import { ChainId, NativeCurrency } from '@usedapp/core'

export const FACTORY_ADDRESS: { [chainId: number]: string } = {
  [ChainId.Rinkeby]: '0x5e02B60e676CF965DEb29df522FE26f0c1d5d771',
}

export const REALITY_ADDRESS: { [chainId: number]: string } = {
  [ChainId.Rinkeby]: '0x3D00D77ee771405628a4bA4913175EcC095538da',
}

export const NATIVE_CURRENCY: { [chainId: number]: NativeCurrency } = {
  [ChainId.Rinkeby]: new NativeCurrency('Ether', 'ETH', ChainId.Rinkeby, 18),
}

export { FACTORY_ABI, REALITY_ABI, ERC20_ABI, KPI_TOKEN_ABI }
