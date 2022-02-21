import { defaultAbiCoder } from '@ethersproject/abi'
import { Web3Provider } from '@ethersproject/providers'
import { ChainId } from '../../../commons/constants'
import { OracleDataDecoder } from '..'
import { OracleDataType } from '../../oracle'

export const TEMPLATE_ID = 1

export const decodeData: OracleDataDecoder = async (_chainId: ChainId, data: string, _provider: Web3Provider) => {
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
