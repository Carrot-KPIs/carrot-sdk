import { OracleDataDecoder } from '..'

export const TEMPLATE_ID = 1

export const VERSION_DECODER: { [version: string]: OracleDataDecoder } = {
  'v1.0.0': require('./v1.0.0').decodeData,
}
