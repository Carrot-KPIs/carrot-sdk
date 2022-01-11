import { Platform } from './platform'
import { ChartDataPoint } from '../../chart-data-point'
import { TotalSupplyToken } from '../../token'
import { DateTime } from 'luxon'

export interface TokenMarketCapPlatform extends Platform {
  tokenMarketCap(token: TotalSupplyToken, from: DateTime, to: DateTime, granularity: number): Promise<ChartDataPoint[]>
}
