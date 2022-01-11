import { Contract } from '@ethersproject/contracts'
import { BaseProvider } from '@ethersproject/providers'
import { Interface } from '@ethersproject/abi'
import { PERMISSIVE_MULTICALL_ADDRESS, PERMISSIVE_MULTICALL_ABI } from './commons/constants'
import { Token } from './entities/token'
import ERC20_ABI from './abis/erc20.json'
import BYTES_NAME_ERC20_ABI from './abis/erc20-name-bytes.json'
import BYTES_SYMBOL_ERC20_ABI from './abis/erc20-symbol-bytes.json'
import invariant from 'tiny-invariant'
import { ChainId } from './commons/constants'

const TOKEN_CACHE: { [chainId in ChainId]: { [address: string]: Token } } = {
  [ChainId.MAINNET]: {},
  [ChainId.RINKEBY]: {},
  [ChainId.XDAI]: {},
}

export abstract class Fetcher {
  private constructor() {}

  public static async fetchTokensData(
    addresses: string[],
    provider: BaseProvider
  ): Promise<{ [address: string]: Token }> {
    const chainId = provider.network.chainId
    invariant(chainId in ChainId, 'invalid chain id')

    const { cachedTokens, missingTokens } = addresses.reduce(
      (accumulator: { cachedTokens: { [address: string]: Token }; missingTokens: string[] }, address) => {
        const cachedToken = TOKEN_CACHE[chainId as ChainId][address]
        if (!!cachedToken) accumulator.cachedTokens[address] = cachedToken
        else accumulator.missingTokens.push(address)
        return accumulator
      },
      { cachedTokens: {}, missingTokens: [] }
    )
    if (missingTokens.length === 0) return cachedTokens

    const permissiveMulticall = new Contract(
      PERMISSIVE_MULTICALL_ADDRESS[provider.network.chainId as ChainId],
      PERMISSIVE_MULTICALL_ABI,
      provider
    )
    const standardErc20Interface = new Interface(ERC20_ABI)
    const bytesNameErc20Interface = new Interface(BYTES_NAME_ERC20_ABI)
    const bytesSymbolErc20Interface = new Interface(BYTES_SYMBOL_ERC20_ABI)

    const nameFunction = standardErc20Interface.getFunction('name()')
    const symbolFunction = standardErc20Interface.getFunction('symbol()')
    const decimalsFunction = standardErc20Interface.getFunction('decimals()')
    const bytesNameFunction = bytesNameErc20Interface.getFunction('name()')
    const bytesSymbolFunction = bytesSymbolErc20Interface.getFunction('symbol()')

    const nameFunctionData = standardErc20Interface.encodeFunctionData(nameFunction)
    const symbolFunctionData = standardErc20Interface.encodeFunctionData(symbolFunction)
    const decimalsFunctionData = standardErc20Interface.encodeFunctionData(decimalsFunction)
    const bytesNameFunctionData = bytesNameErc20Interface.encodeFunctionData(bytesNameFunction)
    const bytesSymbolFunctionData = bytesSymbolErc20Interface.encodeFunctionData(bytesSymbolFunction)

    const calls = addresses.flatMap((address: string) => [
      [address, nameFunctionData],
      [address, symbolFunctionData],
      [address, decimalsFunctionData],
      [address, bytesNameFunctionData],
      [address, bytesSymbolFunctionData],
    ])

    const result = await permissiveMulticall.aggregateWithPermissiveness(calls)
    const returnData = result[1]
    const fetchedTokens = missingTokens.reduce((accumulator: { [address: string]: Token }, missingToken, index) => {
      const wrappedName = returnData[index * 5]
      const wrappedSymbol = returnData[index * 5 + 1]
      const wrappedDecimals = returnData[index * 5 + 2]
      const wrappedBytesName = returnData[index * 5 + 3]
      const wrappedBytesSymbol = returnData[index * 5 + 4]
      if (
        (!wrappedSymbol.success && !wrappedBytesSymbol.success) ||
        (!wrappedName.success && wrappedBytesName.success) ||
        !wrappedDecimals.success
      ) {
        console.warn(`could not fetch ERC20 data for address ${missingToken}`)
        return accumulator
      }

      let name
      try {
        name = standardErc20Interface.decodeFunctionResult(nameFunction, wrappedName.data)[0]
      } catch (error) {
        try {
          name = bytesNameErc20Interface.decodeFunctionResult(bytesNameFunction, wrappedBytesName.data)[0]
        } catch (error) {
          console.warn(`could not decode ERC20 token name for address ${missingToken}`)
          return accumulator
        }
      }

      let symbol
      try {
        symbol = standardErc20Interface.decodeFunctionResult(symbolFunction, wrappedSymbol.data)[0]
      } catch (error) {
        try {
          symbol = bytesSymbolErc20Interface.decodeFunctionResult(bytesSymbolFunction, wrappedBytesSymbol.data)[0]
        } catch (error) {
          console.warn(`could not decode ERC20 token symbol for address ${missingToken}`)
          return accumulator
        }
      }

      try {
        const token = new Token(
          chainId,
          missingToken,
          standardErc20Interface.decodeFunctionResult(decimalsFunction, wrappedDecimals.data)[0],
          symbol,
          name
        )
        TOKEN_CACHE[chainId as ChainId][missingToken] = token
        accumulator[missingToken] = token
      } catch (error) {
        console.error(`error decoding ERC20 data for address ${missingToken}`)
        throw error
      }
      return accumulator
    }, {})

    return { ...cachedTokens, ...fetchedTokens }
  }
}
