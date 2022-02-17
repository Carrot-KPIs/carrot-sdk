import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { Interface } from '@ethersproject/abi'
import {
  PERMISSIVE_MULTICALL_ADDRESS,
  PERMISSIVE_MULTICALL_ABI,
  FACTORY_ADDRESS,
  ChainId,
  IPFS_GATEWAY,
} from './commons/constants'
import { Token } from './entities/token'
import ERC20_ABI from './abis/erc20.json'
import BYTES_NAME_ERC20_ABI from './abis/erc20-name-bytes.json'
import BYTES_SYMBOL_ERC20_ABI from './abis/erc20-symbol-bytes.json'
import KPI_TOKEN_ABI from './abis/kpi-token.json'
import ORACLE_ABI from './abis/oracle.json'
import FACTORY_ABI from './abis/factory.json'
import invariant from 'tiny-invariant'
import { BLOCK_SUBGRAPH_CLIENTS } from './commons/graphql'
import { AddressZero } from '@ethersproject/constants'
import { KpiToken, KpiTokenDescription } from './entities/kpi-token'
import { Cacher } from './cacher'
import { Decoder } from './decoder'
import { OracleTemplateSpecification, KpiTokenTemplateSpecification } from './entities/template-specification'
import { Oracle } from './entities/oracle'
import { gql } from '@apollo/client'

// FIXME: consider using localstorage instead of this ephemeral cache
const TOKEN_CACHE: { [chainId in ChainId]: { [address: string]: Token } } = {
  [ChainId.MAINNET]: {},
  [ChainId.RINKEBY]: {},
  [ChainId.GNOSIS]: {},
}

// erc20 related interfaces
const STANDARD_ERC20_INTERFACE = new Interface(ERC20_ABI)
const BYTES_NAME_ERC20_INTERFACE = new Interface(BYTES_NAME_ERC20_ABI)
const BYTES_SYMBOL_ERC20_INTERFACE = new Interface(BYTES_SYMBOL_ERC20_ABI)

// erc20 related functions
const ERC20_NAME_FUNCTION = STANDARD_ERC20_INTERFACE.getFunction('name()')
const ERC20_SYMBOL_FUNCTION = STANDARD_ERC20_INTERFACE.getFunction('symbol()')
const ERC20_DECIMALS_FUNCTION = STANDARD_ERC20_INTERFACE.getFunction('decimals()')
const ERC20_BYTES_NAME_FUNCTION = BYTES_NAME_ERC20_INTERFACE.getFunction('name()')
const ERC20_BYTES_SYMBOL_FUNCTION = BYTES_SYMBOL_ERC20_INTERFACE.getFunction('symbol()')

// erc20 related function datas
const ERC20_NAME_FUNCTION_DATA = STANDARD_ERC20_INTERFACE.encodeFunctionData(
  STANDARD_ERC20_INTERFACE.getFunction('name()')
)
const ERC20_SYMBOL_FUNCTION_DATA = STANDARD_ERC20_INTERFACE.encodeFunctionData(
  STANDARD_ERC20_INTERFACE.getFunction('symbol()')
)
const ERC20_DECIMALS_FUNCTION_DATA = STANDARD_ERC20_INTERFACE.encodeFunctionData(
  STANDARD_ERC20_INTERFACE.getFunction('decimals()')
)
const ERC20_BYTES_NAME_FUNCTION_DATA = BYTES_NAME_ERC20_INTERFACE.encodeFunctionData(
  BYTES_NAME_ERC20_INTERFACE.getFunction('name()')
)
const ERC20_BYTES_SYMBOL_FUNCTION_DATA = BYTES_SYMBOL_ERC20_INTERFACE.encodeFunctionData(
  BYTES_SYMBOL_ERC20_INTERFACE.getFunction('symbol()')
)

// platform related interfaces
const KPI_TOKEN_INTERFACE = new Interface(KPI_TOKEN_ABI)
const ORACLE_INTERFACE = new Interface(ORACLE_ABI)

// platform related functions
const KPI_TOKEN_TEMPLATE_FUNCTION = KPI_TOKEN_INTERFACE.getFunction('template()')
const KPI_TOKEN_FINALIZED_FUNCTION = KPI_TOKEN_INTERFACE.getFunction('finalized()')
const KPI_TOKEN_DESCRIPTION_FUNCTION = KPI_TOKEN_INTERFACE.getFunction('description()')
const KPI_TOKEN_DATA_FUNCTION = KPI_TOKEN_INTERFACE.getFunction('data()')
const KPI_TOKEN_ORACLES_FUNCTION = KPI_TOKEN_INTERFACE.getFunction('oracles()')

const ORACLE_TEMPLATE_FUNCTION = ORACLE_INTERFACE.getFunction('template()')
const ORACLE_FINALIZED_FUNCTION = KPI_TOKEN_INTERFACE.getFunction('finalized()')
const ORACLE_DATA_FUNCTION = KPI_TOKEN_INTERFACE.getFunction('data()')

// platform related function data
const KPI_TOKEN_TEMPLATE_FUNCTION_DATA = KPI_TOKEN_INTERFACE.encodeFunctionData(KPI_TOKEN_TEMPLATE_FUNCTION)
const KPI_TOKEN_FINALIZED_FUNCTION_DATA = KPI_TOKEN_INTERFACE.encodeFunctionData(KPI_TOKEN_FINALIZED_FUNCTION)
const KPI_TOKEN_DESCRIPTION_FUNCTION_DATA = KPI_TOKEN_INTERFACE.encodeFunctionData(KPI_TOKEN_DESCRIPTION_FUNCTION)
const KPI_TOKEN_DATA_FUNCTION_DATA = KPI_TOKEN_INTERFACE.encodeFunctionData(KPI_TOKEN_DATA_FUNCTION)
const KPI_TOKEN_ORACLES_FUNCTION_DATA = KPI_TOKEN_INTERFACE.encodeFunctionData(KPI_TOKEN_ORACLES_FUNCTION)

const ORACLE_TEMPLATE_FUNCTION_DATA = ORACLE_INTERFACE.encodeFunctionData(ORACLE_TEMPLATE_FUNCTION)
const ORACLE_FINALIZED_FUNCTION_DATA = ORACLE_INTERFACE.encodeFunctionData(ORACLE_FINALIZED_FUNCTION)
const ORACLE_DATA_FUNCTION_DATA = ORACLE_INTERFACE.encodeFunctionData(ORACLE_DATA_FUNCTION)

export abstract class Fetcher {
  private constructor() {}

  public static async fetchErc20Tokens(
    chainId: ChainId,
    addresses: string[],
    provider: Web3Provider
  ): Promise<{ [address: string]: Token }> {
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

    const calls = addresses.flatMap((address: string) => [
      [address, ERC20_NAME_FUNCTION_DATA],
      [address, ERC20_SYMBOL_FUNCTION_DATA],
      [address, ERC20_DECIMALS_FUNCTION_DATA],
      [address, ERC20_BYTES_NAME_FUNCTION_DATA],
      [address, ERC20_BYTES_SYMBOL_FUNCTION_DATA],
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
        name = STANDARD_ERC20_INTERFACE.decodeFunctionResult(ERC20_NAME_FUNCTION, wrappedName.data)[0]
      } catch (error) {
        try {
          name = BYTES_NAME_ERC20_INTERFACE.decodeFunctionResult(ERC20_BYTES_NAME_FUNCTION, wrappedBytesName.data)[0]
        } catch (error) {
          console.warn(`could not decode ERC20 token name for address ${missingToken}`)
          return accumulator
        }
      }

      let symbol
      try {
        symbol = STANDARD_ERC20_INTERFACE.decodeFunctionResult(ERC20_SYMBOL_FUNCTION, wrappedSymbol.data)[0]
      } catch (error) {
        try {
          symbol = BYTES_SYMBOL_ERC20_INTERFACE.decodeFunctionResult(
            ERC20_BYTES_SYMBOL_FUNCTION,
            wrappedBytesSymbol.data
          )[0]
        } catch (error) {
          console.warn(`could not decode ERC20 token symbol for address ${missingToken}`)
          return accumulator
        }
      }

      try {
        const token = new Token(
          chainId,
          missingToken,
          STANDARD_ERC20_INTERFACE.decodeFunctionResult(ERC20_DECIMALS_FUNCTION, wrappedDecimals.data)[0],
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

  public static blocksFromTimestamps = async (
    chainId: ChainId,
    timestamps: number[]
  ): Promise<{ number: number; timestamp: number }[]> => {
    if (!timestamps || timestamps.length === 0) return []

    const blocksSubgraph = BLOCK_SUBGRAPH_CLIENTS[chainId]
    if (!blocksSubgraph) return []

    const promises = timestamps.map((timestamp) =>
      blocksSubgraph.query<{
        [timestampString: string]: { number: string }[]
      }>({
        query: gql`
          query blocks {
              t${timestamp}: blocks(
                first: 1
                orderBy: number
                orderDirection: asc
                where: { timestamp_gt: ${Math.floor(timestamp / 1000)} }
              ) {
              number
            }
          }
        `,
      })
    )

    return (await Promise.all(promises)).reduce((accumulator: { timestamp: number; number: number }[], { data }) => {
      for (const [timestampString, blocks] of Object.entries(data)) {
        if (blocks.length > 0) {
          accumulator.push({
            timestamp: parseInt(timestampString.substring(1)),
            number: parseInt(blocks[0].number),
          })
        }
      }
      return accumulator
    }, [])
  }

  public static async fetchTemplateSpecifications<
    T extends OracleTemplateSpecification | KpiTokenTemplateSpecification
  >(cids: string[]): Promise<{ [cid: string]: T }> {
    const oracleSpecifications: { [cid: string]: T } = {}
    const uncachedCids = []
    for (const cid of cids) {
      const cachedSpecification = Cacher.get<T>(cid)
      if (!!cachedSpecification) oracleSpecifications[cid] = cachedSpecification
      else uncachedCids.push(cid)
    }
    if (uncachedCids.length > 0) {
      const uncachedOracleTemplateSpecifications = await Promise.all(
        uncachedCids.map(async (templateCid: string) => {
          const response = await fetch(IPFS_GATEWAY + templateCid)
          if (!response.ok) throw new Error(`could not fetch oracle template specification with cid ${templateCid}`)
          return [templateCid, await response.json()]
        })
      )
      for (const [cid, specification] of uncachedOracleTemplateSpecifications) {
        oracleSpecifications[cid] = specification
        Cacher.set(cid, specification, Date.now() + 86400) // valid for a day
      }
    }
    return oracleSpecifications
  }

  public static async fetchKpiTokenDescriptions(cids: string[]): Promise<{ [cid: string]: KpiTokenDescription }> {
    const descriptions: { [cid: string]: KpiTokenDescription } = {}
    const uncachedCids = []
    for (const cid of cids) {
      const cachedDescription = Cacher.get<KpiTokenDescription>(cid)
      if (!!cachedDescription) descriptions[cid] = cachedDescription
      else uncachedCids.push(cid)
    }
    if (uncachedCids.length > 0) {
      const uncachedDescriptions = await Promise.all(
        uncachedCids.map(async (templateCid: string) => {
          const response = await fetch(IPFS_GATEWAY + templateCid)
          if (!response.ok) throw new Error(`could not fetch kpi token description with cid ${templateCid}`)
          return [templateCid, await response.json()]
        })
      )
      for (const [cid, description] of uncachedDescriptions) {
        descriptions[cid] = description
        Cacher.set(cid, description, Number.MAX_SAFE_INTEGER) // valid forever (descriptions can't change)
      }
    }
    return descriptions
  }

  public static async fetchKpiToken(chainId: ChainId, address: string, provider: Web3Provider): Promise<KpiToken> {
    invariant(!!address && address !== AddressZero, 'invalid kpi token address')

    const permissiveMulticall = new Contract(PERMISSIVE_MULTICALL_ADDRESS[chainId], PERMISSIVE_MULTICALL_ABI, provider)

    const [, kpiTokenResult] = await permissiveMulticall.aggregate([
      [address, KPI_TOKEN_FINALIZED_FUNCTION_DATA],
      [address, KPI_TOKEN_DESCRIPTION_FUNCTION_DATA],
      [address, KPI_TOKEN_DATA_FUNCTION_DATA],
      [address, KPI_TOKEN_TEMPLATE_FUNCTION_DATA],
      [address, KPI_TOKEN_ORACLES_FUNCTION_DATA],
    ])

    const kpiTokenFinalized = KPI_TOKEN_INTERFACE.decodeFunctionResult(
      KPI_TOKEN_FINALIZED_FUNCTION,
      kpiTokenResult[0]
    )[0]
    const kpiTokenDescriptionCid = KPI_TOKEN_INTERFACE.decodeFunctionResult(
      KPI_TOKEN_DESCRIPTION_FUNCTION,
      kpiTokenResult[1]
    )[0]
    const kpiTokenData = KPI_TOKEN_INTERFACE.decodeFunctionResult(KPI_TOKEN_DATA_FUNCTION, kpiTokenResult[2])[0]
    const kpiTokenTemplate = KPI_TOKEN_INTERFACE.decodeFunctionResult(KPI_TOKEN_TEMPLATE_FUNCTION, kpiTokenResult[3])[0]
    const kpiTokenOracleAddresses = KPI_TOKEN_INTERFACE.decodeFunctionResult(
      KPI_TOKEN_ORACLES_FUNCTION,
      kpiTokenResult[4]
    )[0]

    const [, oraclesResult] = await permissiveMulticall.aggregate(
      kpiTokenOracleAddresses.flatMap((oracleAddress: string) => {
        return [
          [oracleAddress, ORACLE_TEMPLATE_FUNCTION_DATA],
          [oracleAddress, ORACLE_FINALIZED_FUNCTION_DATA],
          [oracleAddress, ORACLE_DATA_FUNCTION_DATA],
        ]
      })
    )

    const allOracleSpecificationCids: string[] = []
    for (let i = 0; i < oraclesResult.length; i += 3) {
      const cid = ORACLE_INTERFACE.decodeFunctionResult(ORACLE_TEMPLATE_FUNCTION, oraclesResult[i])[0].specification
      if (allOracleSpecificationCids.indexOf(cid) < 0) allOracleSpecificationCids.push(cid)
    }

    const oracleTemplateSpecifications = await Fetcher.fetchTemplateSpecifications<OracleTemplateSpecification>(
      allOracleSpecificationCids
    )

    const kpiTokenTemplateSpecification = (
      await Fetcher.fetchTemplateSpecifications<KpiTokenTemplateSpecification>([kpiTokenTemplate.specification])
    )[kpiTokenTemplate.specification]

    const kpiTokenDescription = (await Fetcher.fetchKpiTokenDescriptions([kpiTokenDescriptionCid]))[0]

    const oracles = []
    for (let i = 0; i < kpiTokenOracleAddresses.length; i++) {
      const oracleAddress = kpiTokenOracleAddresses[i]
      const { id: templateId, specification } = ORACLE_INTERFACE.decodeFunctionResult(
        ORACLE_TEMPLATE_FUNCTION,
        oraclesResult[i * 3]
      )[0]
      oracles.push(
        new Oracle(
          chainId,
          oracleAddress,
          templateId,
          oracleTemplateSpecifications[specification],
          ORACLE_INTERFACE.decodeFunctionResult(ORACLE_FINALIZED_FUNCTION, oraclesResult[i * 3 + 1])[0],
          await Decoder.decodeOracleData(
            templateId.toNumber(),
            ORACLE_INTERFACE.decodeFunctionResult(ORACLE_DATA_FUNCTION, oraclesResult[i * 3 + 2])[0],
            provider
          )
        )
      )
    }

    const kpiTokenTemplateId = kpiTokenTemplate.id.toNumber()
    return new KpiToken(
      chainId,
      address,
      kpiTokenTemplateId,
      kpiTokenTemplateSpecification,
      oracles,
      kpiTokenDescription,
      kpiTokenFinalized,
      await Decoder.decodeKpiTokenData(chainId, kpiTokenTemplateId, kpiTokenData, provider)
    )
  }

  public static async fetchKpiTokens(chainId: ChainId, provider: Web3Provider): Promise<KpiToken[]> {
    const permissiveMulticall = new Contract(PERMISSIVE_MULTICALL_ADDRESS[chainId], PERMISSIVE_MULTICALL_ABI, provider)
    const factoryContract = new Contract(FACTORY_ADDRESS[chainId], FACTORY_ABI, provider)

    const kpiTokenAmounts = await factoryContract.size()
    const tokenAddresses = await factoryContract.enumerate(0, kpiTokenAmounts)

    const [, kpiTokenResult] = await permissiveMulticall.aggregate(
      tokenAddresses.flatMap((address: string) => {
        return [
          [address, KPI_TOKEN_FINALIZED_FUNCTION_DATA],
          [address, KPI_TOKEN_DESCRIPTION_FUNCTION_DATA],
          [address, KPI_TOKEN_DATA_FUNCTION_DATA],
          [address, KPI_TOKEN_TEMPLATE_FUNCTION_DATA],
          [address, KPI_TOKEN_ORACLES_FUNCTION_DATA],
        ]
      })
    )

    const allKpiTokenSpecificationCids: string[] = []
    for (let i = 3; i < kpiTokenResult.length; i += 5) {
      const cid = KPI_TOKEN_INTERFACE.decodeFunctionResult(KPI_TOKEN_TEMPLATE_FUNCTION, kpiTokenResult[i])[0]
        .specification
      if (allKpiTokenSpecificationCids.indexOf(cid) < 0) allKpiTokenSpecificationCids.push(cid)
    }
    const kpiTokenTemplateSpecifications = await Fetcher.fetchTemplateSpecifications<KpiTokenTemplateSpecification>(
      allKpiTokenSpecificationCids
    )

    const allKpiTokenDescriptionCids: string[] = []
    for (let i = 1; i < kpiTokenResult.length; i += 5) {
      const cid = KPI_TOKEN_INTERFACE.decodeFunctionResult(KPI_TOKEN_DESCRIPTION_FUNCTION, kpiTokenResult[i])[0]
      if (allKpiTokenDescriptionCids.indexOf(cid) < 0) allKpiTokenDescriptionCids.push(cid)
    }
    const kpiTokenDescriptions = await Fetcher.fetchKpiTokenDescriptions(allKpiTokenDescriptionCids)

    const allOracleAddresses: string[] = []
    for (let i = 4; i < kpiTokenResult.length; i += 5)
      allOracleAddresses.push(
        ...KPI_TOKEN_INTERFACE.decodeFunctionResult(KPI_TOKEN_ORACLES_FUNCTION, kpiTokenResult[i])[0]
      )
    const [, oraclesResult] = await permissiveMulticall.aggregate(
      allOracleAddresses.flatMap((oracleAddress: string) => {
        return [
          [oracleAddress, ORACLE_TEMPLATE_FUNCTION_DATA],
          [oracleAddress, ORACLE_FINALIZED_FUNCTION_DATA],
          [oracleAddress, ORACLE_DATA_FUNCTION_DATA],
        ]
      })
    )

    const allOracleSpecificationCids: string[] = []
    for (let i = 0; i < oraclesResult.length; i += 3) {
      const cid = ORACLE_INTERFACE.decodeFunctionResult(ORACLE_TEMPLATE_FUNCTION, oraclesResult[i])[0].specification
      if (allOracleSpecificationCids.indexOf(cid) < 0) allOracleSpecificationCids.push(cid)
    }
    const oracleTemplateSpecifications = await Fetcher.fetchTemplateSpecifications<OracleTemplateSpecification>(
      allOracleSpecificationCids
    )

    const oracles: { [address: string]: Oracle } = {}
    for (let i = 0; i < allOracleAddresses.length; i++) {
      const oracleAddress = allOracleAddresses[i]
      const { id: templateId, specification } = ORACLE_INTERFACE.decodeFunctionResult(
        ORACLE_TEMPLATE_FUNCTION,
        oraclesResult[i * 3]
      )[0]
      oracles[oracleAddress] = new Oracle(
        chainId,
        oracleAddress,
        templateId,
        oracleTemplateSpecifications[specification],
        ORACLE_INTERFACE.decodeFunctionResult(ORACLE_FINALIZED_FUNCTION, oraclesResult[i * 3 + 1])[0],
        await Decoder.decodeOracleData(
          templateId.toNumber(),
          ORACLE_INTERFACE.decodeFunctionResult(ORACLE_DATA_FUNCTION, oraclesResult[i * 3 + 2])[0],
          provider
        )
      )
    }

    const allKpiTokens = []
    for (let i = 0; i < kpiTokenAmounts; i++) {
      const kpiTokenFinalized = KPI_TOKEN_INTERFACE.decodeFunctionResult(
        KPI_TOKEN_FINALIZED_FUNCTION,
        kpiTokenResult[i * 5]
      )[0]
      const kpiTokenDescriptionCid = KPI_TOKEN_INTERFACE.decodeFunctionResult(
        KPI_TOKEN_DESCRIPTION_FUNCTION,
        kpiTokenResult[i * 5 + 1]
      )[0]
      const kpiTokenData = KPI_TOKEN_INTERFACE.decodeFunctionResult(
        KPI_TOKEN_DATA_FUNCTION,
        kpiTokenResult[i * 5 + 2]
      )[0]
      const kpiTokenTemplate = KPI_TOKEN_INTERFACE.decodeFunctionResult(
        KPI_TOKEN_TEMPLATE_FUNCTION,
        kpiTokenResult[i * 5 + 3]
      )[0]
      const kpiTokenOracleAddresses = KPI_TOKEN_INTERFACE.decodeFunctionResult(
        KPI_TOKEN_ORACLES_FUNCTION,
        kpiTokenResult[i * 5 + 4]
      )[0]

      const kpiTokenOracles: Oracle[] = []
      for (const address of kpiTokenOracleAddresses) kpiTokenOracles.push(oracles[address])

      const kpiTokenTemplateId = kpiTokenTemplate.id.toNumber()
      allKpiTokens.push(
        new KpiToken(
          chainId,
          tokenAddresses[i],
          kpiTokenTemplateId,
          kpiTokenTemplateSpecifications[kpiTokenTemplate.specification],
          kpiTokenOracles,
          kpiTokenDescriptions[kpiTokenDescriptionCid],
          kpiTokenFinalized,
          await Decoder.decodeKpiTokenData(chainId, kpiTokenTemplateId, kpiTokenData, provider)
        )
      )
    }
    return allKpiTokens
  }
}
