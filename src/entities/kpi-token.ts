import { BigNumber } from '@ethersproject/bignumber'
import { KpiTokenTemplateSpecification } from './template-specification'
import { ChainId, Amount, Token, TvlPlatform, TokenMarketCapPlatform, TokenPricePlatform } from '@carrot-kpi/sdk-core'
import { TemplateVersion } from './template-version'
import { Oracle } from './oracle'

enum Widget {
  TOKEN_MARKET_CAP,
  TOKEN_PRICE,
  TVL,
}

interface BaseFrontendWidgetDetails {
  from: number
  to: number
  granularity: number
}

interface TokenMarketCapDetails extends BaseFrontendWidgetDetails {
  tokenAddress: string
  pricingPlatform: TokenMarketCapPlatform
}

interface TokenPriceDetails extends BaseFrontendWidgetDetails {
  tokenAddress: string
  pricingPlatform: TokenPricePlatform
}

interface TvlDetails extends BaseFrontendWidgetDetails {
  pricingPlatform: TokenPricePlatform
  platform: TvlPlatform
}

type WidgetDetails<T extends Widget> = T extends Widget.TOKEN_MARKET_CAP
  ? TokenMarketCapDetails
  : T extends Widget.TOKEN_PRICE
  ? TokenPriceDetails
  : T extends Widget.TVL
  ? TvlDetails
  : never

interface WidgetSpecification {
  type: Widget
  details: WidgetDetails<WidgetSpecification['type']>
}

export interface KpiTokenDescription {
  ipfsHash: string
  title: string
  description: string
  tags: string[]
  widgets: WidgetSpecification[]
}

export enum KpiTokenDataType {
  ERC20,
  AAVE_ERC20,
}

export interface Erc20KpiTokenData {
  type: KpiTokenDataType.ERC20
  collaterals: Amount<Token>[]
  minimumPayouts: Amount<Token>[]
  oracles: {
    lowerBound: BigNumber
    higherBound: BigNumber
    finalProgress: BigNumber
    weight: BigNumber
  }[]
  andRelationship: boolean
  initialSupply: BigNumber
  name: string
  symbol: string
}

export interface AaveErc20KpiTokenData {
  type: KpiTokenDataType.AAVE_ERC20
  collaterals: Amount<Token>[]
  minimumPayouts: Amount<Token>[]
  aTokens: Amount<Token>[]
  oracles: {
    lowerBound: BigNumber
    higherBound: BigNumber
    finalProgress: BigNumber
    weight: BigNumber
  }[]
  andRelationship: boolean
  initialSupply: BigNumber
  name: string
  symbol: string
}

export type KpiTokenData = Erc20KpiTokenData | AaveErc20KpiTokenData

export class KpiToken {
  constructor(
    public readonly chainId: ChainId,
    public readonly address: string,
    public readonly templateId: number,
    public readonly templateVersion: TemplateVersion,
    public readonly templateSpecification: KpiTokenTemplateSpecification,
    public readonly oracles: Oracle[],
    public readonly description: KpiTokenDescription,
    public readonly finalized: boolean,
    public readonly data: KpiTokenData
  ) {}
}
