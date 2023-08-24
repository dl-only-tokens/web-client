import axios from 'axios'

import { config } from '@/config'

type OnlyTokenApiTransfer = {
  network_from: string
  network_to: string
  timestamp: string
  payment_id: string
  recipient: string
  sender: string
  tx_hash_from: string
  tx_hash_to: string
  value_to: string
}

export const useOnlyTokensApi = () => {
  const apiUrl = config.ONLY_TOKENS_API_URL

  const getTransfers = async (account: string): Promise<OnlyTokenApiTransfer[]> => {
    const url = `${apiUrl}/integrations/back-listener/transactions/${account}`

    return (await request(url)).data.attributes.transactions
  }

  const request = async (url: string) => {
    try {
      const res = await axios.get(url)
      if (res.status !== 200) {
        throw new Error(`Invalid response status for request ${url}`)
      }

      return res.data
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)

      return null
    }
  }

  return {
    getTransfers,
  }
}
