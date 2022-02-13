import { defaultAbiCoder } from '@ethersproject/abi'
import { OracleData, OracleDataType } from './entities/oracle'
import { Amount } from './entities/amount'
import { Token } from './entities/token'
import { Web3Provider } from '@ethersproject/providers'
import { Fetcher } from './fetcher'
import { KpiTokenData, KpiTokenDataType } from './entities/kpi-token'
import { ChainId } from './commons/constants'

// FIXME: using maps might clean this up
export abstract class Decoder {
  private constructor() {}

  public static async decodeOracleData(template: number, data: string, _provider: Web3Provider): Promise<OracleData> {
    switch (template) {
      case 0:
      case 1: {
        const [realityAddress, arbitratorAddress, question, timeout, openingTimestamp] = defaultAbiCoder.decode(
          ['address', 'address', 'string', 'uint32', 'uint32'],
          data
        )
        return {
          type: OracleDataType.REALITY,
          realityAddress,
          arbitratorAddress,
          question,
          timeout,
          openingTimestamp,
        }
      }
      case 2: {
        const [refreshRate, startsAt, endsAt, pair, token0, price, timestamp] = defaultAbiCoder.decode(
          ['uint32', 'uint64', 'uint64', 'address', 'bool', 'uint256', 'uint32'],
          data
        )
        return {
          type: OracleDataType.AUTOMATED_UNISWAP_V2_TOKEN_PRICE,
          refreshRate,
          startsAt,
          endsAt,
          pair,
          token0,
          price,
          timestamp,
        }
      }
      default: {
        throw new Error(`unsupported oracle template ${template}`)
      }
    }
  }

  public static async decodeKpiTokenData(
    chainId: ChainId,
    template: number,
    data: string,
    provider: Web3Provider
  ): Promise<KpiTokenData> {
    switch (template) {
      case 0: {
        const [
          collateralTokenAddresses,
          collateralAmounts,
          collateralMinimumPayouts,
          lowerBounds,
          higherBounds,
          finalProgresses,
          weights,
          andRelationship,
          initialSupply,
          name,
          symbol,
        ] = defaultAbiCoder.decode(
          [
            'address[]',
            'uint256[]',
            'uint256[]',
            'uint256[]',
            'uint256[]',
            'uint256[]',
            'uint256[]',
            'bool',
            'uint256',
            'string',
            'string',
          ],
          data
        )

        const collateralTokens = await Fetcher.fetchErc20Tokens(chainId, collateralTokenAddresses, provider)
        const collaterals: Amount<Token>[] = []
        const minimumPayouts: Amount<Token>[] = []
        for (let i = 0; i < collateralTokenAddresses.length; i++) {
          const collateralToken = collateralTokens[collateralTokenAddresses[i]]
          collaterals.push(new Amount(collateralToken, collateralAmounts[i]))
          minimumPayouts.push(new Amount(collateralToken, collateralMinimumPayouts[i]))
        }

        const oracles = []
        for (let i = 0; i < lowerBounds.length; i++)
          oracles.push({
            lowerBound: lowerBounds[i],
            higherBound: higherBounds[i],
            finalProgress: finalProgresses[i],
            weight: weights[i],
          })

        return {
          type: KpiTokenDataType.ERC20,
          collaterals,
          minimumPayouts,
          oracles,
          andRelationship,
          initialSupply,
          name,
          symbol,
        }
      }
      case 1: {
        const [
          collateralTokenAddresses,
          collateralAmounts,
          collateralMinimumPayouts,
          aTokenAddresses,
          lowerBounds,
          higherBounds,
          finalProgresses,
          weights,
          andRelationship,
          initialSupply,
          name,
          symbol,
        ] = defaultAbiCoder.decode(
          [
            'address[]',
            'uint256[]',
            'uint256[]',
            'address[]',
            'uint256[]',
            'uint256[]',
            'uint256[]',
            'uint256[]',
            'bool',
            'uint256',
            'string',
            'string',
          ],
          data
        )

        const tokens = await Fetcher.fetchErc20Tokens(
          chainId,
          [...collateralTokenAddresses, ...aTokenAddresses],
          provider
        )
        const collaterals: Amount<Token>[] = []
        const aTokens: Amount<Token>[] = []
        const minimumPayouts: Amount<Token>[] = []
        for (let i = 0; i < collateralTokenAddresses.length; i++) {
          const collateralToken = tokens[collateralTokenAddresses[i]]
          collaterals.push(new Amount(collateralToken, collateralAmounts[i]))
          aTokens.push(new Amount(tokens[aTokenAddresses[i]], collateralAmounts[i]))
          minimumPayouts.push(new Amount(collateralToken, collateralMinimumPayouts[i]))
        }

        const oracles = []
        for (let i = 0; i < lowerBounds.length; i++)
          oracles.push({
            lowerBound: lowerBounds[i],
            higherBound: higherBounds[i],
            finalProgress: finalProgresses[i],
            weight: weights[i],
          })

        return {
          type: KpiTokenDataType.AAVE_ERC20,
          collaterals,
          minimumPayouts,
          aTokens,
          oracles,
          andRelationship,
          initialSupply,
          name,
          symbol,
        }
      }
      default: {
        throw new Error(`unsupported kpi token template ${template}`)
      }
    }
  }
}
