import { defaultAbiCoder } from '@ethersproject/abi'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '@carrot-kpi/sdk-core'
import { OracleDataDecoder } from '../'
import { OracleDataType } from '../../../oracle'

export const decodeData: OracleDataDecoder = async (_chainId: ChainId, data: string, _provider: Web3Provider) => {
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
