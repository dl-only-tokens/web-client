import { defineStore } from 'pinia'

import { generateWallet, restoreWalletFromPrivateKey } from '@/plugins'

interface AccountStore {
  privateKey: undefined | string
  address: undefined | string
}

export const useAccountStore = defineStore('account-store', {
  state: () =>
    ({
      privateKey: undefined,
      address: undefined,
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
  },
})
