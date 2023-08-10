export const config = {
  DOMAIN: import.meta.env.VITE_DOMAIN,

  ETHERS_PROVIDER: import.meta.env.VITE_ETHERS_PROVIDER,
  EXPLORER_URL: import.meta.env.VITE_EXPLORER_URL,

  SELLER_TOKEN: import.meta.env.VITE_SELLER_TOKEN,

  SWAP_CHAINS: import.meta.env.VITE_SWAP_CHAINS.split(',') as string[],
  SWAP_DEFAULT_FROM_CHAIN: import.meta.env.VITE_SWAP_DEFAULT_FROM_CHAIN as string,
  SWAP_DEFAULT_TO_CHAIN: import.meta.env.VITE_SWAP_DEFAULT_TO_CHAIN as string,
  SWAP_DEFAULT_TO_CURRENCY: import.meta.env.VITE_SWAP_DEFAULT_TO_CURRENCY as string,
  SWAP_DEFAULT_TO_DECIMALS: Number(import.meta.env.VITE_SWAP_DEFAULT_TO_DECIMALS),
}
