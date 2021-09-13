import { Amount } from './amount'
import invariant from 'tiny-invariant'
import { BigNumber } from '@ethersproject/bignumber'
import { DateTime } from 'luxon'
import Decimal from 'decimal.js-light'
import { ChainId, Token } from '@usedapp/core'
import { tokensEqual } from '../utils'
import { CurrencyFormatOptions, DEFAULT_OPTIONS, formatCurrency } from '@usedapp/core/dist/esm/src/model/formatting'

export class KpiToken {
  // token data
  public readonly name: string
  public readonly ticker: string
  public readonly chainId: ChainId
  public readonly address: string
  public readonly decimals = 18
  public readonly formattingOptions: CurrencyFormatOptions

  public readonly kpiId: string
  public readonly totalSupply: Amount<Token>
  public readonly oracle: string
  public readonly question: string
  public readonly lowerBound: BigNumber
  public readonly higherBound: BigNumber
  public readonly finalProgress: BigNumber
  public readonly expiresAt: DateTime
  public readonly finalized: boolean
  public readonly kpiReached: boolean
  public readonly creator: string
  public readonly collateral: Amount<Token>
  public readonly fee: Amount<Token>

  constructor(
    chainId: ChainId,
    address: string,
    symbol: string,
    name: string,
    kpiId: string,
    totalSupply: BigNumber,
    oracle: string,
    question: string,
    lowerBound: BigNumber,
    higherBound: BigNumber,
    finalProgress: BigNumber,
    expiresAt: DateTime,
    finalized: boolean,
    kpiReached: boolean,
    creator: string,
    collateral: Amount<Token>,
    fee: Amount<Token>
  ) {
    this.name = name
    this.ticker = symbol
    this.chainId = chainId
    this.address = address
    this.formattingOptions = {
      ...DEFAULT_OPTIONS,
      suffix: ` ${this.ticker}`,
      significantDigits: 4,
      decimals: 18,
    }

    invariant(collateral.currency.chainId === chainId, 'inconsistent chain id in collateral')
    invariant(tokensEqual(fee.currency, collateral.currency), 'inconsistent collateral and fee token')
    invariant(fee.currency.chainId === chainId, 'inconsistent chain id in collateral')
    invariant(lowerBound.lt(higherBound), 'inconsistent scalar bounds')
    this.kpiId = kpiId
    this.totalSupply = new Amount<Token>(this, totalSupply)
    this.oracle = oracle
    this.question = question
    this.lowerBound = lowerBound
    this.higherBound = higherBound
    this.finalProgress = finalProgress
    this.expiresAt = expiresAt
    this.finalized = finalized
    this.kpiReached = kpiReached
    this.creator = creator
    this.collateral = collateral
    this.fee = fee
  }

  public get progressPercentage(): Decimal {
    const kpiScalarRange = this.higherBound.sub(this.lowerBound)
    return new Decimal(this.finalProgress.toString()).dividedBy(kpiScalarRange.toString()).times(100)
  }

  public format(value: string, overrideOptions: Partial<CurrencyFormatOptions> = {}) {
    return formatCurrency({ ...this.formattingOptions, ...overrideOptions }, value)
  }
}
