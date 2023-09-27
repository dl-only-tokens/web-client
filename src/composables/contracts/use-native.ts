import { ethers, providers } from 'ethers'
import { storeToRefs } from 'pinia'
import { Ref, ref, toRaw } from 'vue'

import { useNotifications } from '@/composables'
import { getChainInfoById, zeroAddress } from '@/helpers'
import { useAccountStore, useProviderStore } from '@/store'

export interface NativeInterface {
  chainId: Ref<string>
  address: Ref<string>
  name: Ref<string>
  symbol: Ref<string>
  decimals: Ref<number>
  init: (address: string) => Promise<void>
  balanceOf: (address: string) => Promise<string>
  transferSigned: (to: string, amount: string) => Promise<providers.TransactionResponse | null>
}

export const useNative = (chain?: string): NativeInterface => {
  const { defaultProvider } = storeToRefs(useProviderStore())
  const { privateKey } = storeToRefs(useAccountStore())
  const notifications = useNotifications()

  const chainId = ref<string>('')
  const address = ref<string>('')
  const name = ref<string>('')
  const symbol = ref<string>('')
  const decimals = ref<number>(0)

  const init = async (chainIdArg: string) => {
    chainId.value = chainIdArg
    address.value = zeroAddress

    const chainInfo = getChainInfoById(chainIdArg)

    name.value = chainInfo.tokenName
    symbol.value = chainInfo.tokenSymbol
    decimals.value = chainInfo.tokenDecimals
  }

  const balanceOf = async (address: string): Promise<string> => {
    const provider = toRaw(defaultProvider.value)
    if (!provider) return '0'

    return (await provider.getBalance(address)).toString()
  }

  const transferSigned = async (to: string, amount: string): Promise<providers.TransactionResponse | null> => {
    try {
      if (!defaultProvider.value) {
        throw new Error("Default provider isn't defined")
      }

      if (!privateKey.value) {
        throw new Error("Private key isn't defined")
      }

      const wallet = new ethers.Wallet(privateKey.value, toRaw(defaultProvider.value))

      const transaction = {
        to: to,
        value: amount,
      }

      notifications.showToastInfo('Transaction has been sent to processing, please wait.')

      const tx = await wallet.sendTransaction(transaction)
      await tx.wait()

      const chainInfo = getChainInfoById(chainId.value)
      notifications.showToastSuccess({
        message: 'Transfer completed successfully.',
        link: {
          label: 'View transaction',
          href: `${chainInfo.explorerUrl}/tx/${tx.hash}`,
        },
      })

      return tx
    } catch (e) {
      notifications.showToastError('An error occurred while forming a transaction.')
      // eslint-disable-next-line no-console
      console.error(e)

      return null
    }
  }

  if (chain) {
    init(chain)
  }

  return {
    init,

    chainId,
    address,
    decimals,
    name,
    symbol,

    balanceOf,
    transferSigned,
  }
}
