export type Chain = {
  id: number
  name: string
  explorerUrl: string
}

const chains: Chain[] = [
  {
    id: 1,
    name: 'Ethereum',
    explorerUrl: 'https://etherscan.io',
  },
  {
    id: 5,
    name: 'Goerli',
    explorerUrl: 'https://goerli.etherscan.io',
  },
  {
    id: 137,
    name: 'Polygon',
    explorerUrl: 'https://polygonscan.com',
  },
  {
    id: 43114,
    name: 'Avalanche',
    explorerUrl: 'https://snowtrace.io',
  },
  {
    id: 43113,
    name: 'Fuji',
    explorerUrl: 'https://testnet.snowtrace.io',
  },
  {
    id: 56,
    name: 'BSC',
    explorerUrl: 'https://bscscan.com',
  },
  {
    id: 97,
    name: 'BSC Testnet',
    explorerUrl: 'https://testnet.bscscan.com',
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
