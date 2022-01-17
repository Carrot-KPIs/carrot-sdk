import { getAddress } from '@ethersproject/address'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'
import { DateTime } from 'luxon'

export function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address)
    warning(address === checksummedAddress, `${address} is not checksummed.`)
    return checksummedAddress
  } catch (error) {
    invariant(false, `${address} is not a valid address.`)
  }
}

export const getTimestampsFromRange = (from: DateTime, to: DateTime, granularity: number): number[] => {
  let loopedDate = from
  let timestamps = []
  while (loopedDate.toMillis() < to.toMillis()) {
    timestamps.push(loopedDate.toMillis())
    loopedDate = loopedDate.plus({ seconds: granularity })
  }
  return timestamps
}

