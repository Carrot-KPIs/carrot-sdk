import { getAddress, isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { ChainId } from '../constants'
import invariant from 'tiny-invariant'

export class Currency {
  public readonly decimals: BigNumber
  public readonly symbol: string
  public readonly name: string

  public static ETHER = new Currency(BigNumber.from(18), 'ETH', 'Ether')

  public constructor(decimals: BigNumber, symbol: string, name: string) {
    this.decimals = decimals
    this.symbol = symbol
    this.name = name
  }

  public static getNative(chainId: ChainId): Currency {
    switch (chainId) {
      case ChainId.RINKEBY:
      case ChainId.MAINNET: {
        return Currency.ETHER
      }
      default: {
        invariant(false, 'not a valid chain id when getting native currency')
      }
    }
  }

  public equals(other: Currency): boolean {
    if (this instanceof Token && other instanceof Token) {
      return this.equals(other)
    }
    return this === other
  }
}

export class Token extends Currency {
  public readonly chainId: ChainId
  public readonly address: string

  public constructor(chainId: ChainId, address: string, decimals: BigNumber, symbol: string, name: string) {
    super(decimals, symbol, name)
    this.chainId = chainId
    invariant(isAddress(address), `${address} is not a valid address`)
    this.address = getAddress(address)
  }

  public equals(other: Token): boolean {
    if (this === other) {
      return true
    }
    return this.chainId === other.chainId && this.address === other.address
  }
}
