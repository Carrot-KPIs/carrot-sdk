import invariant from 'tiny-invariant'
import { Decimal } from 'decimal.js-light'
import { BigNumber } from '@ethersproject/bignumber'

export class Fraction {
  public readonly numerator: BigNumber
  public readonly denominator: BigNumber

  public constructor(numerator: BigNumber, denominator: BigNumber) {
    this.numerator = numerator
    this.denominator = denominator
  }

  public add(other: Fraction): Fraction {
    if (this.denominator.eq(other.denominator)) {
      return new Fraction(this.numerator.add(other.numerator), this.denominator)
    }
    return new Fraction(
      this.numerator.mul(other.denominator).add(other.numerator.mul(this.denominator)),
      this.denominator.mul(other.denominator)
    )
  }

  public subtract(other: Fraction): Fraction {
    if (this.denominator.eq(other.denominator)) {
      return new Fraction(this.numerator.sub(other.numerator), this.denominator)
    }
    return new Fraction(
      this.numerator.mul(other.denominator).sub(other.numerator.mul(this.denominator)),
      this.denominator.mul(other.denominator)
    )
  }

  public lessThan(other: Fraction): boolean {
    return this.numerator.mul(other.denominator).lt(other.numerator.mul(this.denominator))
  }

  public equalTo(other: Fraction): boolean {
    return this.numerator.mul(other.denominator).eq(other.numerator.mul(this.denominator))
  }

  public greaterThan(other: Fraction): boolean {
    return this.numerator.mul(other.denominator).gt(other.numerator.mul(this.denominator))
  }

  public isZero(): boolean {
    return this.numerator.eq(0)
  }

  public multiply(other: Fraction): Fraction {
    return new Fraction(this.numerator.mul(other.numerator), this.denominator.mul(other.denominator))
  }

  public divide(other: Fraction): Fraction {
    return new Fraction(this.numerator.mul(other.denominator), this.denominator.mul(other.numerator))
  }

  public toFixed(decimalPlaces: number): string {
    invariant(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`)
    invariant(decimalPlaces >= 0, `${decimalPlaces} is negative.`)
    return new Decimal(this.numerator.toString()).dividedBy(this.denominator.toString()).toFixed(decimalPlaces)
  }
}
