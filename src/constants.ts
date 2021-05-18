import FACTORY_ABI from './abis/factory.json'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export enum ChainId {
  MAINNET = 1,
  RINKEBY = 4
}

export const FACTORY_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: ZERO_ADDRESS,
  [ChainId.RINKEBY]: '0x74acc6C5a3aE974f8BbDf461aC0250a353A76499'
}

export { FACTORY_ABI }
