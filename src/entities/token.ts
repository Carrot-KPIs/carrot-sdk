import { validateAndParseAddress } from '../utils'
import { ChainId } from '../constants'
import { Currency } from './currency'

export class Token extends Currency {
  public readonly chainId: ChainId
  public readonly address: string

  public constructor(chainId: ChainId, address: string, decimals: number, symbol: string, name: string) {
    super(symbol, name, decimals)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  public equals(other: Token): boolean {
    return this === other || (this.chainId === other.chainId && this.address === other.address)
  }
}

export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) return currencyA.equals(currencyB)
  else if (currencyA instanceof Token) return false
  else if (currencyB instanceof Token) return false
  else return currencyA === currencyB
}
