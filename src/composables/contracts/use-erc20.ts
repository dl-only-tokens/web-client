import { Contract, ethers } from 'ethers'
import { TransactionResponse } from 'ethers'
import { storeToRefs } from 'pinia'
import { ref, toRaw } from 'vue'

import { config } from '@/config'
import { useAccountStore, useProviderStore } from '@/store'

import { useNotifications } from '../use-notifications'
import abi from './abis/erc20.json'

export const useERC20 = (contractAddress?: string) => {
  const { defaultProvider } = storeToRefs(useProviderStore())
  const { privateKey } = storeToRefs(useAccountStore())
  const notifications = useNotifications()

  let _instance: Contract | undefined = undefined

  const address = ref<string>()
  const name = ref<string>()
  const symbol = ref<string>()
  const decimals = ref<number>()

  const init = async (contractAddress: string) => {
    address.value = contractAddress

    const contract = new ethers.Contract(contractAddress, abi, toRaw(defaultProvider.value))
    _instance = contract

    const [_name, _symbol, _decimals] = await Promise.all([_instance.name(), _instance.symbol(), _instance.decimals()])
    name.value = _name
    symbol.value = _symbol
    decimals.value = _decimals
  }

  const balanceOf = async (address: string): Promise<string> => {
    if (!_instance) return '0'

    return (await _instance.balanceOf(address)).toString()
  }

  const transferSigned = async (to: string, amount: string): Promise<TransactionResponse | null> => {
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

      const nonce = await wallet.getNonce()

      const transaction = {
        to: address.value,
        data: transferMethod,
        nonce: nonce,
      }

      notifications.showToastInfo('Transaction has been sent to processing, please wait.')

      const tx = await wallet.sendTransaction(transaction)
      await tx.wait()

      notifications.showToastSuccess({
        message: 'Transfer completed successfully.',
        link: {
          label: 'View transaction',
          href: `${config.EXPLORER_URL}/tx/${tx.hash}`,
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
