import { ApolloClient, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { ChainId } from './constants'

export const CARROT_SUBGRAPH_CLIENT: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/carrot-rinkeby',
    cache: new InMemoryCache(),
  }),
  [ChainId.GNOSIS]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/carrot-xdai',
    cache: new InMemoryCache(),
  }),
}

export const SWAPR_SUBGRAPH_CLIENT: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.MAINNET]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr-mainnet-v2',
    cache: new InMemoryCache(),
  }),
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr-rinkeby-new',
    cache: new InMemoryCache(),
  }),
  [ChainId.GNOSIS]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/swapr-xdai-v2',
    cache: new InMemoryCache(),
  }),
}

export const HONEYSWAP_SUBGRAPH_CLIENT: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.GNOSIS]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-v2',
    cache: new InMemoryCache(),
  }),
}

export const UNISWAP_V2_SUBGRAPH_CLIENT: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.MAINNET]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    cache: new InMemoryCache(),
  }),
}

export const AGAVE_SUBGRAPH_CLIENT: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/pjcolombo/agave-rinkeby',
    cache: new InMemoryCache(),
  }),
  [ChainId.GNOSIS]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/agave-dao/agave-xdai',
    cache: new InMemoryCache(),
  }),
}

export const MOCHI_SUBGRAPH_CLIENT: { [chainId: number]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.MAINNET]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/luzzif/usdm-data',
    cache: new InMemoryCache(),
  }),
}

export const BLOCK_SUBGRAPH_CLIENTS: { [chainId in ChainId]: ApolloClient<NormalizedCacheObject> } = {
  [ChainId.MAINNET]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/alium-finance/mainnet-blocks',
    cache: new InMemoryCache(),
  }),
  [ChainId.RINKEBY]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/rinkeby-blocks',
    cache: new InMemoryCache(),
  }),
  [ChainId.GNOSIS]: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/1hive/xdai-blocks',
    cache: new InMemoryCache(),
  }),
}
