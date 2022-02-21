import { defaultAbiCoder } from '@ethersproject/abi'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '../../../../commons/constants'
import { KpiTokenDataDecoder } from '../'
import { Fetcher } from '../../../../fetcher'
import { Amount } from '../../../amount'
import { Token } from '../../../token'
import { KpiTokenDataType } from '../../../kpi-token'

export const decodeData: KpiTokenDataDecoder = async (chainId: ChainId, data: string, provider: Web3Provider) => {
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

  const tokens = await Fetcher.fetchErc20Tokens(chainId, [...collateralTokenAddresses, ...aTokenAddresses], provider)
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
