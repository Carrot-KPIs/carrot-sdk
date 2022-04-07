import { Amount, ChainId, Token } from '@carrot-kpi/sdk-core'
import invariant from 'tiny-invariant'
import { BigNumber } from '@ethersproject/bignumber'
import { DateTime } from 'luxon'
import Decimal from 'decimal.js-light'

export class KpiToken extends Token {
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
    super(chainId, address, 18, symbol, name) // decimals are always 18 for kpi tokens
    invariant(collateral.currency.chainId === chainId, 'inconsistent chain id in collateral')
    invariant(fee.currency.equals(collateral.currency), 'inconsistent collateral and fee token')
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
}
