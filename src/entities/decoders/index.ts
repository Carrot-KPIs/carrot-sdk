import { OracleData } from '../oracle'
import { Web3Provider } from '@ethersproject/providers'
import { KpiTokenData } from '../kpi-token'
import { ChainId } from '../../commons/constants'

// importing kpi token data decoders
import { TEMPLATE_ID as ERC20_TEMPLATE_ID, decodeData as decodeErc20KpiTokenData } from './kpi-tokens/erc20'
import {
  TEMPLATE_ID as AAVE_ERC20_TEMPLATE_ID,
  decodeData as decodeAaveErc20KpiTokenData,
} from './kpi-tokens/aave-erc20'

// importing oracle data decoders
import {
  TEMPLATE_ID as MANUAL_REALITY_TEMPLATE_ID,
  decodeData as decodeManualRealityOracleData,
} from './oracles/manual-reality'
import {
  TEMPLATE_ID as AUTOMATED_REALITY_TEMPLATE_ID,
  decodeData as decodeAutomatedRealityOracleData,
} from './oracles/automated-reality'
import {
  TEMPLATE_ID as AUTOMATED_UNISWAP_V2_PRICE_TEMPLATE_ID,
  decodeData as decodeAutomatedUniswapV2OracleData,
} from './oracles/automated-uniswap-v2-price'

export type KpiTokenDataDecoder = (chainId: ChainId, data: string, provider: Web3Provider) => Promise<KpiTokenData>
export type OracleDataDecoder = (chainId: ChainId, data: string, provider: Web3Provider) => Promise<OracleData>

const KPI_TOKEN_DATA_DECODER: { [templateId: number]: KpiTokenDataDecoder } = {
  [ERC20_TEMPLATE_ID]: decodeErc20KpiTokenData,
  [AAVE_ERC20_TEMPLATE_ID]: decodeAaveErc20KpiTokenData,
}

const ORACLE_DATA_DECODER: { [templateId: number]: OracleDataDecoder } = {
  [MANUAL_REALITY_TEMPLATE_ID]: decodeManualRealityOracleData,
  [AUTOMATED_REALITY_TEMPLATE_ID]: decodeAutomatedRealityOracleData,
  [AUTOMATED_UNISWAP_V2_PRICE_TEMPLATE_ID]: decodeAutomatedUniswapV2OracleData,
}

// FIXME: using maps might clean this up
export abstract class Decoder {
  private constructor() {}

  public static async decodeOracleData(
    chainId: ChainId,
    template: number,
    data: string,
    provider: Web3Provider
  ): Promise<OracleData> {
    const decode = ORACLE_DATA_DECODER[template]
    if (!!!decode) throw new Error(`unsupported oracle template ${template}`)
    return decode(chainId, data, provider)
  }

  public static async decodeKpiTokenData(
    chainId: ChainId,
    template: number,
    data: string,
    provider: Web3Provider
  ): Promise<KpiTokenData> {
    const decode = KPI_TOKEN_DATA_DECODER[template]
    if (!!!decode) throw new Error(`unsupported kpi token template ${template}`)
    return decode(chainId, data, provider)
  }
}
