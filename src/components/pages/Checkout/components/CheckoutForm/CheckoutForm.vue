<script setup lang="ts">
import {
  BridgeChain,
  CheckoutOperation,
  createCheckoutOperation,
  EVMOperation,
  PaymentToken,
  Price,
} from '@rarimo/nft-checkout'
import { Provider, Providers } from '@rarimo/provider'
import { EthersProvider } from '@rarimo/providers-evm'
import { ethers } from 'ethers'
import { ref, toRaw, watch } from 'vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { AppButton, AppInput, AppRadio, AppRadioOption, AppSelect } from '@/components/common'
import { PaymentInfo } from '@/components/pages/Checkout/components/CheckoutForm/components'
import { Erc20Interface, NativeInterface, useNotifications } from '@/composables'
import { config } from '@/config'
import { ROUTE_NAME } from '@/enums'
import { Chain, getChainInfoById, getChainInfoByName, getRandomHexString, stringToBytes, zeroAddress } from '@/helpers'
import { formatUnits, parseEther, toBn } from '@/plugins'
import { useAccountStore, useProviderStore } from '@/store'

const props = defineProps<{
  receiverToken: Erc20Interface | NativeInterface
  receiver: string
  toDefaultNetwork: Chain
  isReceiverTokenNative: boolean
}>()

// Configure router and params
const router = useRouter()

// Configure provider and params
const providerStore = useProviderStore()
const accountStore = useAccountStore()
providerStore.iniBrowserProvider()

// Configure notifications
const notifications = useNotifications()

// START configure page variables
const minReceiveAmount = ref()

const formNetworks = ref()
const formDefaultNetwork = ref<string | undefined>()
const formCurrencies = ref<AppRadioOption[]>([])

const checkoutOperation = ref<CheckoutOperation | undefined>()
const supportedNetworks = ref<BridgeChain[] | undefined>()
const supportedCurrencies = ref<PaymentToken[] | undefined>()
const selectedAmount = ref<string | undefined>()
const selectedNetwork = ref<Chain | undefined>()
const selectedCurrency = ref<PaymentToken | undefined>()
const payInfo = ref({
  amountIn: '',
  impact: '0',
})

const isPriceConversionLoad = ref<boolean>(false)
const isTxInProgress = ref<boolean>(false)
// END

const init = async () => {
  const provider = new Provider(EthersProvider)
  try {
    await provider.init({
      name: Providers.Ethers,
      instance: toRaw(providerStore.browserProvider),
    })

    await props.receiverToken.init(props.isReceiverTokenNative ? config.SWAP_DEFAULT_TO_CHAIN : config.SELLER_TOKEN)

    minReceiveAmount.value = formatUnits('1', {
      decimals: props.receiverToken.decimals.value,
      isForDisplay: false,
      decimalPlaces: props.receiverToken.decimals.value,
    })

    checkoutOperation.value = createCheckoutOperation(EVMOperation, provider)

    const _supportedNetworks = await checkoutOperation.value.getSupportedChains()
    supportedNetworks.value = _supportedNetworks.filter(v => config.SWAP_CHAINS.includes(v.id.toString()))
    formNetworks.value = supportedNetworks.value.map(v => getChainInfoById(v.id).name)
  } catch {
    console.error('Browser provider is not defined')
  }
}

// On amount change, skip to default `payInfo`
const onAmountChange = () => {
  _resetCurrencyForm(false)

  payInfo.value = {
    amountIn: '',
    impact: '0',
  }
}

// On amount blur, recalculate available currency list
const onAmountBlur = async (v: string) => {
  if (/^\d+.*\.$/.test(v) || /^0*$/.test(v) || !selectedNetwork.value) {
    return
  }

  if (toBn(v).isLessThan(minReceiveAmount.value)) {
    notifications.showToastError(
      `The number is too low. Minimal available amount is ${minReceiveAmount.value} ${props.receiverToken.symbol.value}`,
    )

    return
  }

  selectedAmount.value = v
  await _recalculateAvailableCurrencies(selectedNetwork.value, selectedAmount.value)
}

// On network change, recalculate available currency list, only if amount setted
const onNetworkChange = async (v: string) => {
  selectedNetwork.value = getChainInfoByName(v)
  if (selectedAmount.value) {
    await _recalculateAvailableCurrencies(selectedNetwork.value, selectedAmount.value)
  }
}

// On currency change, recalculate `payInfo`
const onCurrencyChange = async (v: string | undefined) => {
  if (!v || !selectedAmount.value || !checkoutOperation.value) {
    return
  }

  selectedCurrency.value = supportedCurrencies.value?.find(e => e.symbol.toLowerCase() === v.toLowerCase())
  if (!selectedCurrency.value) {
    return
  }

  payInfo.value = {
    amountIn: '',
    impact: '0',
  }
  isPriceConversionLoad.value = true

  const estimatedPrice = await checkoutOperation.value.estimatePrice([selectedCurrency.value])
  payInfo.value = {
    amountIn: formatUnits(estimatedPrice[0].amountIn.value, {
      decimals: estimatedPrice[0].amountIn.decimals,
      decimalPlaces: estimatedPrice[0].amountIn.decimals,
    }),
    impact: estimatedPrice[0].impact ?? '',
  }

  isPriceConversionLoad.value = false
}

// Form submit
const onClickFormSubmit = async () => {
  if (
    !checkoutOperation.value ||
    !selectedCurrency.value ||
    !selectedNetwork.value ||
    !accountStore.browserWallet.address
  ) {
    return
  }

  isTxInProgress.value = true

  const amountWei = parseEther(selectedAmount.value, props.receiverToken.decimals.value)

  const paymentId = getRandomHexString().slice(2)
  const toChainId = props.toDefaultNetwork.id
  const fromChainId = selectedNetwork.value.id
  const currency = props.receiverToken.symbol.value
  const sender = accountStore.browserWallet.address.slice(2)

  const paymentString = `fa1afb7a:${paymentId}:${fromChainId}:${toChainId}:${amountWei}:${currency}:${props.receiver}:${sender};`
  const paymentBytesString = stringToBytes(paymentString)

  const bundle = ethers.utils.defaultAbiCoder.encode(
    ['address[]', 'uint256[]', 'bytes[]'],
    [[props.receiver], ['0'], [paymentBytesString]],
  )

  const estimatedPrice = await checkoutOperation.value.estimatePrice([selectedCurrency.value])

  notifications.showToastInfo('Transaction has been sent to processing, please wait.')

  try {
    const txHash = await checkoutOperation.value.checkout(estimatedPrice, { bundle })

    notifications.showToastSuccess({
      message: 'Transfer completed successfully.',
      link: {
        label: 'View transaction',
        href: `${selectedNetwork.value.explorerUrl}/tx/${txHash}`,
      },
    })

    router.push({ name: ROUTE_NAME.paymentSuccess })
  } catch {
    notifications.showToastError('The user rejected the transaction.')
  }

  isTxInProgress.value = false
}

// Recalculate available currencies
const _recalculateAvailableCurrencies = async (chain: Chain, amount: string) => {
  if (!checkoutOperation.value) {
    return
  }

  payInfo.value = {
    amountIn: '',
    impact: '0',
  }

  _resetCurrencyForm(true)

  // Restore new available currencies
  const params = {
    chainIdFrom: chain.id,
    chainIdTo: config.SWAP_DEFAULT_TO_CHAIN,
    price: Price.fromRaw(
      amount,
      props.receiverToken.decimals.value,
      props.receiverToken.symbol.value,
      props.receiverToken.address.value === zeroAddress ? undefined : props.receiverToken.address.value,
    ),
    recipient: props.receiver,
  }

  try {
    await checkoutOperation.value.init(params)
    supportedCurrencies.value = await checkoutOperation.value.getPaymentTokens()
    if (!supportedCurrencies.value.length) {
      formCurrencies.value = [{ label: 'Not found', value: '0', attrs: { disabled: true } }]
    } else {
      formCurrencies.value = supportedCurrencies.value.map(v => {
        return {
          label: v.symbol,
          value: v.symbol,
        }
      })
    }
  } catch (e) {
    console.error(e)

    notifications.showToastError('Failed to load available token list')
    formCurrencies.value = [{ label: 'Not found', value: '0', attrs: { disabled: true } }]
  }
}

// Reset currency form
const _resetCurrencyForm = (isLoadingLabel: boolean) => {
  selectedCurrency.value = undefined
  formCurrencies.value = [{ label: isLoadingLabel ? 'Loading...' : 'Not found', value: '0', attrs: { disabled: true } }]
}

// Setup form default values
const _setupFormDefaultValues = () => {
  if (!accountStore.browserWallet.address) {
    return
  }

  const accountNetwork = supportedNetworks.value?.find(e => e.id === accountStore.browserWallet.chainId)
  const connectToNetwork = accountNetwork
    ? getChainInfoById(accountNetwork.id)
    : getChainInfoById(config.SWAP_DEFAULT_FROM_CHAIN)

  formDefaultNetwork.value = connectToNetwork.name
  selectedNetwork.value = connectToNetwork

  _resetCurrencyForm(false)
}

onMounted(async () => {
  await init()
  _setupFormDefaultValues()
})

watch(() => accountStore.browserWallet.address, _setupFormDefaultValues)
</script>

<template>
  <form-kit type="form" :actions="false" :incomplete-message="false" @submit="onClickFormSubmit">
    <section class="info-section">
      <h2 class="info-section__subtitle">Buyer information</h2>
      <div class="info-section__block">
        <p class="info-section__block__name">Sender address</p>
        <span class="info-section__block__value">{{ accountStore.browserWallet?.address ?? 'No address' }}</span>
      </div>
      <div v-if="accountStore.browserWallet?.address" class="form-container">
        <app-input
          name="amount"
          label="Amount of tokens for the receiver"
          placeholder="100"
          validation="required|number"
          :disabled="isTxInProgress || isPriceConversionLoad"
          @change="onAmountChange"
          @blur="onAmountBlur"
        />
        <app-select
          name="network"
          label="Sender network"
          :options="formNetworks"
          :default-value="formDefaultNetwork"
          :disabled="isTxInProgress || isPriceConversionLoad"
          placeholder="Select network"
          validation="required"
          @change="onNetworkChange"
        />
        <app-radio
          name="currency"
          label="Sender currency"
          :options="formCurrencies"
          :disabled="isTxInProgress || isPriceConversionLoad"
          validation="required"
          @change="onCurrencyChange"
        />
        <payment-info
          :receiver-token="receiverToken"
          :selected-amount="selectedAmount"
          :selected-currency="selectedCurrency"
          :pay-info="payInfo"
        />
      </div>
    </section>
    <app-button
      v-if="accountStore.browserWallet?.address"
      :disabled="!payInfo.amountIn.length"
      :loading="isTxInProgress"
      title="Send"
    />
  </form-kit>
</template>

<style scoped lang="scss">
.info-section {
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 32px;

  @include respond-to(mobile) {
    padding: 16px;
    gap: 16px;
  }

  border-radius: 16px;
  border: 1px solid var(--border-secondary);

  &__subtitle {
    font-size: 22px;
    font-weight: 500;
    line-height: 30px;

    @include respond-to(mobile) {
      font-size: 20px;
    }
  }

  &__block {
    display: flex;
    flex-direction: column;
    gap: 8px;

    @include respond-to(mobile) {
      font-size: 6px;
    }

    &__name {
      color: var(--text-secondary);
      font-size: 16px;

      @include respond-to(mobile) {
        font-size: 14px;
      }
    }

    &__value {
      color: var(--text-primary);
      font-size: 16px;
      line-height: 24px;
      word-wrap: break-word;

      @include respond-to(mobile) {
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.app-button-container {
  margin-top: 24px;
  width: 100%;
}
</style>
