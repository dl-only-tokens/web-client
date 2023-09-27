import { defineStore } from 'pinia'
import { toRaw } from 'vue'

import { useBreakpoints, useNotifications } from '@/composables'
import { generateWallet, restoreWalletFromPrivateKey } from '@/helpers'

import { useProviderStore } from './provider.store'

interface AccountStore {
  privateKey: string | undefined
  address: string | undefined
  browserWallet: {
    address: string | undefined
    chainId: number | undefined
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
      // @dev Setup your private key to show your account
      // localStorage.setItem('privateKey', '<your_private_key>')

      const existingPrivateKey = localStorage.getItem('privateKey')
      if (!existingPrivateKey) {
        const { address, privateKey } = generateWallet()
        this.address = address
        this.privateKey = privateKey

        localStorage.setItem('privateKey', privateKey)

        return
      }

      const { address, privateKey } = restoreWalletFromPrivateKey(existingPrivateKey)
      this.address = address
      this.privateKey = privateKey
    },
    async initBrowserWallet() {
      const notifications = useNotifications()
      const providerStore = useProviderStore()
      const breakpoints = useBreakpoints()

      if (!providerStore.browserProvider) {
        if (breakpoints.isMobile.value) {
          window.open(`https://metamask.app.link/dapp/${window.location.href}`, '_blank', 'noopener')

          return
        }

        notifications.showToastError("MetaMask isn't installed!")

        return
      }

      await toRaw(providerStore.browserProvider).send('eth_requestAccounts', [])

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
