import { ethers } from 'ethers'
import { defineStore } from 'pinia'

import { config } from '@/config'

interface ProviderStore {
  defaultProvider: undefined | ethers.providers.JsonRpcProvider
  browserProvider: undefined | ethers.providers.Web3Provider
}

export const useProviderStore = defineStore('provider-store', {
  state: () =>
    ({
      defaultProvider: undefined,
      browserProvider: undefined,
    }) as ProviderStore,
  actions: {
    initDefaultProvider() {
      this.defaultProvider = new ethers.providers.JsonRpcProvider(config.ETHERS_PROVIDER)
    },
    async iniBrowserProvider() {
      if (typeof window.ethereum === 'undefined') {
        return
      }

      this.browserProvider = new ethers.providers.Web3Provider(window.ethereum)
    },
  },
})
