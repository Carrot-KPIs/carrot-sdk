import { BigNumber } from '@ethersproject/bignumber'
import { OracleTemplateSpecification } from './template-specification'
import { ChainId } from '@carrot-kpi/sdk-core'
import { TemplateVersion } from './template-version'

export enum OracleDataType {
  REALITY,
  AUTOMATED_UNISWAP_V2_TOKEN_PRICE,
}

export interface RealityOracleData {
  type: OracleDataType.REALITY
  realityAddress: string
  arbitratorAddress: string
  question: string
  timeout: number
  openingTimestamp: number
}

export interface AutomatedUniswapV2TokenPriceOracleData {
  type: OracleDataType.AUTOMATED_UNISWAP_V2_TOKEN_PRICE
  refreshRate: number
  startsAt: number
  endsAt: number
  pair: string
  token0: boolean
  price: BigNumber
  timestamp: number
}

export type OracleData = RealityOracleData | AutomatedUniswapV2TokenPriceOracleData

export class Oracle {
  constructor(
    public readonly chainId: ChainId,
    public readonly address: string,
    public readonly templateId: number,
    public readonly templateVersion: TemplateVersion,
    public readonly templateSpecification: OracleTemplateSpecification,
    public readonly finalized: boolean,
    public readonly data: OracleData
  ) {}
}
