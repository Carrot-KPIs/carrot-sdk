import { validateAndParseAddress } from '../utils'
import { ChainId } from '../constants'
import { Currency } from './currency'

export class Token extends Currency {
  public readonly chainId: ChainId
  public readonly address: string

  public static readonly WETH: { [key: number]: Token } = {
    [ChainId.MAINNET]: new Token(
      ChainId.RINKEBY,
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      18,
      'WETH',
      'Wrapped Ether'
    ),
    [ChainId.RINKEBY]: new Token(
      ChainId.RINKEBY,
      '0xc778417E063141139Fce010982780140Aa0cD5Ab',
      18,
      'WETH',
      'Wrapped Ether'
    ),
    [ChainId.XDAI]: new Token(
      ChainId.XDAI,
      '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
      18,
      'WETH',
      'Wrapped Ether on xDai'
    ),
  }

  public static readonly WXDAI: { [key: number]: Token } = {
    [ChainId.XDAI]: new Token(ChainId.XDAI, '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d', 18, 'WXDAI', 'Wrapped xDAI'),
  }

  private static readonly NATIVE_CURRENCY_WRAPPER: { [chainId in ChainId]: Token } = {
    [ChainId.MAINNET]: Token.WETH[ChainId.MAINNET],
    [ChainId.RINKEBY]: Token.WETH[ChainId.RINKEBY],
    [ChainId.XDAI]: Token.WXDAI[ChainId.XDAI],
  }

  public constructor(chainId: ChainId, address: string, decimals: number, symbol: string, name: string) {
    super(symbol, name, decimals)
    this.chainId = chainId
    this.address = validateAndParseAddress(address)
  }

  public equals(other: Token): boolean {
    return this === other || (this.chainId === other.chainId && this.address === other.address)
  }

  public static getNativeWrapper(chainId: ChainId): Token {
    return Token.NATIVE_CURRENCY_WRAPPER[chainId]
  }
}

export function currencyEquals(currencyA: Currency, currencyB: Currency): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token) return currencyA.equals(currencyB)
  else if (currencyA instanceof Token) return false
  else if (currencyB instanceof Token) return false
  else return currencyA === currencyB
}
