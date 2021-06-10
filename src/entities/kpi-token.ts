import { ChainId } from '../constants'
import { TokenAmount } from './currency-amount'
import invariant from 'tiny-invariant'
import { Token } from './currency'
import { BigNumber } from '@ethersproject/bignumber'
import { DateTime } from 'luxon'
import Decimal from 'decimal.js-light'

export class KpiToken extends Token {
  public readonly kpiId: string
  public readonly totalSupply: TokenAmount
  public readonly oracle: string
  public readonly question: string
  public readonly lowerBound: BigNumber
  public readonly higherBound: BigNumber
  public readonly finalProgress: BigNumber
  public readonly expiresAt: DateTime
  public readonly finalized: boolean
  public readonly kpiReached: boolean
  public readonly creator: string
  public readonly collateral: TokenAmount
  public readonly fee: TokenAmount

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
    collateral: TokenAmount,
    fee: TokenAmount
  ) {
    super(chainId, address, BigNumber.from('18'), symbol, name)
    invariant(collateral.token.chainId === chainId, 'inconsistent chain id in collateral')
    invariant(fee.token.equals(collateral.token), 'inconsistent collateral and fee token')
    invariant(fee.token.chainId === chainId, 'inconsistent chain id in collateral')
    invariant(lowerBound.lt(higherBound), 'inconsistent scalar bounds')
    this.kpiId = kpiId
    this.totalSupply = new TokenAmount(this, totalSupply)
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
