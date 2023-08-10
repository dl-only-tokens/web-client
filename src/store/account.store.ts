import { defineStore } from 'pinia'
import { toRaw } from 'vue'

import { useNotifications } from '@/composables'
import { generateWallet, restoreWalletFromPrivateKey } from '@/plugins'

import { useProviderStore } from './provider.store'

interface AccountStore {
  privateKey: undefined | string
  address: undefined | string
  browserWallet: {
    address: undefined | string
    chainId: undefined | number
  }
}

export const useAccountStore = defineStore('account-store', {
  state: () =>
    ({
      privateKey: undefined,
      address: undefined,
      browserWallet: {
        address: undefined,
        chainId: undefined,
      },
    }) as AccountStore,
  actions: {
    initAccount() {
      const existedPrivateKey = localStorage.getItem('privateKey')
      if (!existedPrivateKey) {
        const { address, privateKey } = generateWallet()
        this.address = address
        this.privateKey = privateKey

        localStorage.setItem('privateKey', privateKey)

        return
      }

      const { address, privateKey } = restoreWalletFromPrivateKey(existedPrivateKey)
      this.address = address
      this.privateKey = privateKey
    },
    async initBrowserWallet() {
      const notifications = useNotifications()
      const providerStore = useProviderStore()

      if (!providerStore.browserProvider) {
        notifications.showToastError("MetaMask isn't installed!")
      }

      await toRaw(providerStore.browserProvider)?.send('eth_requestAccounts', [])

      const signer = await toRaw(providerStore.browserProvider)?.getSigner()
      if (!signer) {
        notifications.showToastError("Can't connect browser wallet!")

        return
      }

      const [address, chainId] = await Promise.all([signer.getAddress(), signer.getChainId()])
      this.browserWallet.address = address.toLowerCase()
      this.browserWallet.chainId = chainId
    },
  },
})
