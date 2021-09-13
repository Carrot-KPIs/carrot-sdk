import { Currency, Token } from '@usedapp/core'
import invariant from 'tiny-invariant'
import { BigNumber, formatFixed, parseFixed } from '@ethersproject/bignumber'
import Decimal from 'decimal.js-light'
import { currenciesEqual, tokensEqual } from '../utils'

type TokenOrCurrency = Token | Currency

function tokenOrCurrencyEqual(tokenOrCurrency1: TokenOrCurrency, tokenOrCurrency2: TokenOrCurrency) {
  return (
    (tokenOrCurrency1 instanceof Token &&
      tokenOrCurrency2 instanceof Token &&
      tokensEqual(tokenOrCurrency1, tokenOrCurrency2)) ||
    (tokenOrCurrency1 instanceof Currency &&
      tokenOrCurrency2 instanceof Currency &&
      currenciesEqual(tokenOrCurrency1, tokenOrCurrency2))
  )
}

export class Amount<T extends TokenOrCurrency> extends Decimal {
  public readonly currency: T
  public readonly raw: BigNumber

  public constructor(currency: T, amount: BigNumber) {
    super(new Decimal(formatFixed(amount, currency.decimals)))
    this.currency = currency
    this.raw = amount
  }

  public plus(other: Amount<TokenOrCurrency>): Amount<T> {
    invariant(tokenOrCurrencyEqual(this.currency, other.currency), 'tried to sum different currencies')
    return new Amount<T>(this.currency, this.raw.add(other.raw))
  }

  public minus(other: Amount<T>): Amount<T> {
    invariant(tokenOrCurrencyEqual(this.currency, other.currency), 'tried to sum different currencies')
    return new Amount<T>(this.currency, this.raw.sub(other.raw))
  }

  public multiply<M extends TokenOrCurrency>(other: Amount<M>): Amount<M> {
    return new Amount<M>(
      other.currency,
      parseFixed(this.times(other).toFixed(other.currency.decimals), other.currency.decimals)
    )
  }

  public divide<M extends TokenOrCurrency>(other: Amount<M>): Amount<M> {
    return new Amount<M>(
      other.currency,
      parseFixed(this.dividedBy(other).toFixed(other.currency.decimals), other.currency.decimals)
    )
  }
}
