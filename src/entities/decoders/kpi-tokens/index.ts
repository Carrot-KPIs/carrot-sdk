import { ChainId } from '../../../commons/constants'
import { KpiTokenData } from '../../kpi-token'

import { TEMPLATE_ID as ERC20_TEMPLATE_ID, VERSION_DECODER as erc20VersionDecoder } from './erc20'
import { TEMPLATE_ID as AAVE_ERC20_TEMPLATE_ID, VERSION_DECODER as aaveErc20VersionDecoder } from './aave-erc20'
import { Web3Provider } from '@ethersproject/providers'

export type KpiTokenDataDecoder = (chainId: ChainId, data: string, provider: Web3Provider) => Promise<KpiTokenData>

export const KPI_TOKEN_DATA_DECODER: { [templateId: number]: { [version: string]: KpiTokenDataDecoder } } = {
  [ERC20_TEMPLATE_ID]: erc20VersionDecoder,
  [AAVE_ERC20_TEMPLATE_ID]: aaveErc20VersionDecoder,
}
