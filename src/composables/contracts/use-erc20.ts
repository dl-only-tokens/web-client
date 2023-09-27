import { Contract, ethers, providers } from 'ethers'
import { storeToRefs } from 'pinia'
import { Ref, ref, toRaw } from 'vue'

import { useNotifications } from '@/composables'
import { config } from '@/config'
import { getChainInfoById } from '@/helpers'
import { useAccountStore, useProviderStore } from '@/store'

import abi from './abis/erc20.json'

export interface Erc20Interface {
  address: Ref<string>
  name: Ref<string>
  symbol: Ref<string>
  decimals: Ref<number>
  init: (contractAddress: string, loadMetadata?: boolean) => Promise<void>
  balanceOf: (address: string) => Promise<string>
  transferSigned: (to: string, amount: string) => Promise<providers.TransactionResponse | null>
}

export const useERC20 = (contractAddress?: string): Erc20Interface => {
  const { defaultProvider } = storeToRefs(useProviderStore())
  const { privateKey } = storeToRefs(useAccountStore())
  const notifications = useNotifications()

  let _instance: Contract

  const address = ref<string>('')
  const name = ref<string>('')
  const symbol = ref<string>('')
  const decimals = ref<number>(0)

  const init = async (contractAddress: string, loadMetadata = true) => {
    address.value = contractAddress

    _instance = new ethers.Contract(contractAddress, abi, toRaw(defaultProvider.value))

    if (loadMetadata) {
      const [_name, _symbol, _decimals] = await Promise.all([
        _instance.name(),
        _instance.symbol(),
        _instance.decimals(),
      ])

      name.value = _name
      symbol.value = _symbol
      decimals.value = _decimals
    }
  }

  const balanceOf = async (address: string): Promise<string> => {
    if (!_instance) return '0'

    return (await _instance.balanceOf(address)).toString()
  }

  const transferSigned = async (to: string, amount: string): Promise<providers.TransactionResponse | null> => {
    try {
      if (!defaultProvider.value) {
        throw new Error("Default provider isn't defined")
      }

      if (!_instance) {
        throw new Error("Contract instance isn't defined")
      }

      if (!privateKey.value) {
        throw new Error("Private key isn't defined")
      }

      const wallet = new ethers.Wallet(privateKey.value, toRaw(defaultProvider.value))
      const transferMethod = _instance.interface.encodeFunctionData('transfer', [to, amount])

      const transaction = {
        to: address.value,
        data: transferMethod,
      }

      notifications.showToastInfo('Transaction has been sent to processing, please wait.')

      const tx = await wallet.sendTransaction(transaction)
      await tx.wait()

      const chainInfo = getChainInfoById(config.SWAP_DEFAULT_TO_CHAIN)
      notifications.showToastSuccess({
        message: 'Transfer completed successfully.',
        link: {
          label: 'View transaction',
          href: `${chainInfo.explorerUrl}/tx/${tx.hash}`,
        },
      })

      return tx
    } catch (e) {
      notifications.showToastError('An error occurred while sending transaction.')
      // eslint-disable-next-line no-console
      console.error(e)

      return null
    }
  }

  if (contractAddress) {
    init(contractAddress)
  }

  return {
    init,

    address,
    decimals,
    name,
    symbol,

    balanceOf,
    transferSigned,
  }
}
