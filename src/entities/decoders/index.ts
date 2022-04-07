import { OracleData } from '../oracle'
import { Web3Provider } from '@ethersproject/providers'
import { KpiTokenData } from '../kpi-token'
import { ChainId } from '@carrot-kpi/sdk-core'
import { KPI_TOKEN_DATA_DECODER } from './kpi-tokens'
import { ORACLE_DATA_DECODER } from './oracles'
import { TemplateVersion } from '../template-version'

export abstract class Decoder {
  private constructor() {}

  public static async decodeOracleData(
    chainId: ChainId,
    template: number,
    version: TemplateVersion,
    data: string,
    provider: Web3Provider
  ): Promise<OracleData> {
    const versionDecoder = ORACLE_DATA_DECODER[template]
    if (!!!versionDecoder) throw new Error(`unsupported oracle template ${template}`)
    const versionString = `v${version.major}.${version.minor}.${version.patch}`
    const decode = versionDecoder[versionString]
    if (!!!decode) throw new Error(`unsupported version ${versionString} for oracle template ${template}`)
    return decode(chainId, data, provider)
  }

  public static async decodeKpiTokenData(
    chainId: ChainId,
    template: number,
    version: TemplateVersion,
    data: string,
    provider: Web3Provider
  ): Promise<KpiTokenData> {
    const versionDecoder = KPI_TOKEN_DATA_DECODER[template]
    if (!!!versionDecoder) throw new Error(`unsupported kpi token template ${template}`)
    const versionString = `v${version.major}.${version.minor}.${version.patch}`
    const decode = versionDecoder[versionString]
    if (!!!decode) throw new Error(`unsupported version ${versionString} for kpi token template ${template}`)
    return decode(chainId, data, provider)
  }
}
