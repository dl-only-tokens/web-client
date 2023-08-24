export type Chain = {
  id: number
  name: string
  explorerUrl: string
  tokenSymbol: string
  tokenName: string
  tokenDecimals: number
}

const chains: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    explorerUrl: 'https://etherscan.io',
    tokenSymbol: 'ETH',
    tokenName: 'Ethereum',
    tokenDecimals: 18,
  },
  {
    id: 5,
    name: 'Goerli',
    explorerUrl: 'https://goerli.etherscan.io',
    tokenSymbol: 'ETH',
    tokenName: 'Ethereum',
    tokenDecimals: 18,
  },
  {
    id: 137,
    name: 'Polygon',
    explorerUrl: 'https://polygonscan.com',
    tokenSymbol: 'MATIC',
    tokenName: 'MATIC',
    tokenDecimals: 18,
  },
  {
    id: 43114,
    name: 'Avalanche',
    explorerUrl: 'https://snowtrace.io',
    tokenSymbol: 'AVAX',
    tokenName: 'AVAX',
    tokenDecimals: 18,
  },
  {
    id: 43113,
    name: 'Fuji',
    explorerUrl: 'https://testnet.snowtrace.io',
    tokenSymbol: 'AVAX',
    tokenName: 'AVAX',
    tokenDecimals: 18,
  },
  {
    id: 56,
    name: 'BSC',
    explorerUrl: 'https://bscscan.com',
    tokenSymbol: 'BNB',
    tokenName: 'BNB',
    tokenDecimals: 18,
  },
  {
    id: 97,
    name: 'BSC Testnet',
    explorerUrl: 'https://testnet.bscscan.com',
    tokenSymbol: 'tBNB',
    tokenName: 'tBNB',
    tokenDecimals: 18,
  },
]

export const getChainInfoById = (chainId: string | number): Chain => {
  const chain = chains.find(v => v.id == chainId)
  if (!chain) {
    throw new Error(`Chain with id '${chainId}' isn't found`)
  }

  return chain
}

export const getChainInfoByName = (name: string): Chain => {
  const chain = chains.find(v => v.name.toLowerCase() === name.toLowerCase())
  if (!chain) {
    throw new Error(`Chain with name '${name}' isn't found`)
  }

  return chain
}
