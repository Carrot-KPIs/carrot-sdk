import { Currency, Token } from './currency'
import invariant from 'tiny-invariant'
import { BigNumber } from '@ethersproject/bignumber'

export class CurrencyAmount {
  public readonly currency: Currency
  public readonly amount: BigNumber // amount is in wei here

  protected constructor(currency: Currency, amount: BigNumber) {
    this.currency = currency
    this.amount = amount
  }

  public plus(other: CurrencyAmount): CurrencyAmount {
    invariant(this.currency.equals(other.currency), 'tried to sum different currencies')
    return new CurrencyAmount(this.currency, this.amount.add(other.amount))
  }

  public minus(other: CurrencyAmount): CurrencyAmount {
    invariant(this.currency.equals(other.currency), 'tried to subtract different currencies')
    return new CurrencyAmount(this.currency, this.amount.sub(other.amount))
  }
}

export class TokenAmount extends CurrencyAmount {
  public readonly token: Token

  public constructor(token: Token, amount: BigNumber) {
    super(token, amount)
    this.token = token
  }
}