import { defaultAbiCoder } from '@ethersproject/abi'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '../../../commons/constants'
import { KpiTokenDataDecoder } from '..'
import { Fetcher } from '../../../fetcher'
import { Amount } from '../../amount'
import { Token } from '../../token'
import { KpiTokenDataType } from '../../kpi-token'

export const TEMPLATE_ID = 0

export const decodeData: KpiTokenDataDecoder = async (chainId: ChainId, data: string, provider: Web3Provider) => {
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
