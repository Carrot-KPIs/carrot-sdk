import { Platform } from './platform'
import { ChartDataPoint } from '../../chart-data-point'
import { Token } from '../../token'
import { DateTime } from 'luxon'

export interface TokenPricePlatform extends Platform {
  tokenPrice(token: Token, from: DateTime, to: DateTime, granularity: number): Promise<ChartDataPoint[]>
}
