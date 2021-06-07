import { Currency, Token } from './currency'
import invariant from 'tiny-invariant'
import { BigNumber } from '@ethersproject/bignumber'
import { Fraction } from './fraction'

export class CurrencyAmount extends Fraction {
  public readonly currency: Currency

  public constructor(currency: Currency, amount: BigNumber | Fraction) {
    if (amount instanceof Fraction) {
      super(amount.numerator, amount.denominator)
    } else {
      super(amount, BigNumber.from(10).pow(currency.decimals))
    }
    this.currency = currency
  }

  public plus(other: CurrencyAmount): CurrencyAmount {
    invariant(this.currency.equals(other.currency), 'tried to sum different currencies')
    return new CurrencyAmount(this.currency, super.add(other))
  }

  public minus(other: CurrencyAmount): CurrencyAmount {
    invariant(this.currency.equals(other.currency), 'tried to subtract different currencies')
    return new CurrencyAmount(this.currency, super.subtract(other))
  }

  public multiply(other: CurrencyAmount): CurrencyAmount {
    return new CurrencyAmount(other.currency, super.multiply(other))
  }
}

export class TokenAmount extends CurrencyAmount {
  public readonly token: Token

  public constructor(token: Token, amount: BigNumber | Fraction) {
    super(token, amount)
    this.token = token
  }
}
