import { ChartDataPoint } from "../../chart-data-point"
import { DateTime } from "luxon"

export abstract class Metric {
  public readonly from: DateTime
  public readonly to: DateTime
  protected readonly granularity: number

  constructor(from: DateTime, to: DateTime, granularity: number) {
    this.from = from
    this.to = to
    this.granularity = granularity
  }

  abstract chartData(): Promise<ChartDataPoint[]>

  abstract get name(): string
}
