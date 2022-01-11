import { getAddress } from '@ethersproject/address'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'
import { gql } from '@apollo/client'
import { BLOCK_SUBGRAPH_CLIENTS } from '../commons/graphql'
import { DateTime } from 'luxon'
import { ChainId } from '../commons/constants'

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

const BLOCKS_FROM_TIMESTAMP_BATCH_SIZE = 10
export const getBlocksFromTimestamps = async (
  chainId: ChainId,
  timestamps: number[]
): Promise<{ number: number; timestamp: number }[]> => {
  if (!timestamps || timestamps.length === 0) return []

  const blocksSubgraph = BLOCK_SUBGRAPH_CLIENTS[chainId]
  if (!blocksSubgraph) return []

  let blocksFromSubgraph: { [timestampString: string]: { number: string }[] } = {}
  for (let i = 0; i < Math.ceil(timestamps.length / BLOCKS_FROM_TIMESTAMP_BATCH_SIZE); i++) {
    const sliceStart = i * BLOCKS_FROM_TIMESTAMP_BATCH_SIZE
    const slice = timestamps.slice(sliceStart, sliceStart + BLOCKS_FROM_TIMESTAMP_BATCH_SIZE)
    const { data } = await blocksSubgraph.query<{
      [timestampString: string]: { number: string }[]
    }>({
      query: gql`
        query blocks {
          ${slice.map((timestamp) => {
            return `t${timestamp}: blocks(first: 1, orderBy: number, orderDirection: asc where: { timestamp_gt: ${Math.floor(
              timestamp / 1000
            )} }) {
            number
          }`
          })}
        }
      `,
    })
    blocksFromSubgraph = { ...blocksFromSubgraph, ...data }
  }

  return Object.entries(blocksFromSubgraph).reduce(
    (accumulator: { timestamp: number; number: number }[], [timestampString, blocks]) => {
      if (blocks.length > 0) {
        accumulator.push({
          timestamp: parseInt(timestampString.substring(1)),
          number: parseInt(blocks[0].number),
        })
      }
      return accumulator
    },
    []
  )
}
