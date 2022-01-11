import { TvlPlatform } from './tvl'
import { TokenPricePlatform } from './token-price'
import { TokenMarketCapPlatform } from './token-market-cap'
import { ChartDataPoint } from '../../chart-data-point'
import { Token } from '../../token'
import { DateTime } from 'luxon'

export interface DexPlatform extends TvlPlatform, TokenPricePlatform, TokenMarketCapPlatform {
  pairTvl(tokenA: Token, tokenB: Token, from: DateTime, to: DateTime, granularity: number): Promise<ChartDataPoint[]>
}
