import { Currency, Token } from '@usedapp/core'

export function currenciesEqual(currency1: Currency, currency2: Currency): boolean {
  return (
    currency1.name === currency2.name &&
    currency1.ticker === currency2.ticker &&
    currency1.decimals === currency2.decimals
  )
}

export function tokensEqual(token1: Token, token2: Token): boolean {
  return token1.address === token2.address && token1.chainId === token2.chainId
}
