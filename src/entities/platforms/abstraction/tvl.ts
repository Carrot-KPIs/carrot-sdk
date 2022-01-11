import { ChainId } from '../../../commons/constants'
import { TokenPricePlatform } from './token-price'
import { Platform } from './platform'
import { DateTime } from 'luxon'
import { ChartDataPoint } from '../../chart-data-point'

export interface TvlPlatform extends Platform {
  overallTvl(
    chainId: ChainId,
    pricingPlatform: TokenPricePlatform,
    from: DateTime,
    to: DateTime,
    granularity: number
  ): Promise<ChartDataPoint[]>
}
