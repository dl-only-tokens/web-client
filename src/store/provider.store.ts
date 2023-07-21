import { ethers, JsonRpcProvider } from 'ethers'
import { defineStore } from 'pinia'

import { config } from '@/config'

interface ProviderStore {
  defaultProvider: undefined | JsonRpcProvider
}

export const useProviderStore = defineStore('provider-store', {
  state: () =>
    ({
      defaultProvider: undefined,
    }) as ProviderStore,
  actions: {
    initDefaultProvider() {
      this.defaultProvider = new ethers.JsonRpcProvider(config.ETHERS_PROVIDER)
    },
  },
})
