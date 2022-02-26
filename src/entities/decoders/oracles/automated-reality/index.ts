import { OracleDataDecoder } from '..'
import { decodeData as decodeData100 } from './v1.0.0'

export const TEMPLATE_ID = 1

export const VERSION_DECODER: { [version: string]: OracleDataDecoder } = {
  'v1.0.0': decodeData100,
}
