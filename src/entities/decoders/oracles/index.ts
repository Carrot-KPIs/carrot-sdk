import { ChainId } from '../../../commons/constants'
import { OracleData } from '../../oracle'
import {
  TEMPLATE_ID as MANUAL_REALITY_TEMPLATE_ID,
  VERSION_DECODER as manualRealityVersionDecoder,
} from './manual-reality'
import {
  TEMPLATE_ID as AUTOMATED_REALITY_TEMPLATE_ID,
  VERSION_DECODER as automatedRealityVersionDecoder,
} from './automated-reality'
import {
  TEMPLATE_ID as AUTOMATED_UNISWAP_V2_PRICE_TEMPLATE_ID,
  VERSION_DECODER as automatedUniswapV2PriceVersionDecoder,
} from './automated-uniswap-v2-price'
import { Web3Provider } from '@ethersproject/providers'

export type OracleDataDecoder = (chainId: ChainId, data: string, provider: Web3Provider) => Promise<OracleData>

export const ORACLE_DATA_DECODER: { [templateId: number]: { [version: string]: OracleDataDecoder } } = {
  [MANUAL_REALITY_TEMPLATE_ID]: manualRealityVersionDecoder,
  [AUTOMATED_REALITY_TEMPLATE_ID]: automatedRealityVersionDecoder,
  [AUTOMATED_UNISWAP_V2_PRICE_TEMPLATE_ID]: automatedUniswapV2PriceVersionDecoder,
}
