import { KpiTokenDataDecoder } from '../'
import { decodeData as decodeData100 } from './v1.0.0'

export const TEMPLATE_ID = 0

export const VERSION_DECODER: { [version: string]: KpiTokenDataDecoder } = {
  'v1.0.0': decodeData100,
}
