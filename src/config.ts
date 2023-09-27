export const config = {
  ONLY_TOKENS_API_URL: import.meta.env.VITE_ONLY_TOKENS_API_URL,

  ETHERS_PROVIDER: import.meta.env.VITE_ETHERS_PROVIDER,

  SELLER_TOKEN: import.meta.env.VITE_SELLER_TOKEN,

  SWAP_CHAINS: import.meta.env.VITE_SWAP_CHAINS.split(',') as string[],
  SWAP_DEFAULT_FROM_CHAIN: import.meta.env.VITE_SWAP_DEFAULT_FROM_CHAIN as string,
  SWAP_DEFAULT_TO_CHAIN: import.meta.env.VITE_SWAP_DEFAULT_TO_CHAIN as string,
}
