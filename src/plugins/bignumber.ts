import BigNumber from 'bignumber.js'

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN })

type BigNumberValue = string | number | undefined | BigNumber

type BigNumberOptions = {
  decimals?: number
  decimalPlaces?: number
  isForDisplay?: boolean
}

const toBn = (value: BigNumberValue) => {
  return new BigNumber(value || 0)
}

const parseEther = (value: BigNumberValue, decimals: number = 18) => {
  return toBn(value).multipliedBy(toBn(10).pow(decimals))
}

const formatUnits = (value: BigNumberValue, incomingOptions?: BigNumberOptions): string => {
  const options = { ..._getDefaultOptions(), ...incomingOptions }

  const bn = toBn(value).dividedBy(toBn(10).pow(options.decimals))

  let result
  if (options.isForDisplay) {
    result = bn.toFormat(options.decimalPlaces)

    result = result
      .replace(/[0]*$/, '')
      .replace(/(\.\d*?[1-9])?0+$/, '')
      .replace(/[.]*$/, '')
  } else {
    result = bn.toFixed(options.decimalPlaces)
  }

  return result
}

const _getDefaultOptions = () => {
  return {
    decimals: 18,
    decimalPlaces: 4,
    isForDisplay: true,
  }
}

export { formatUnits, parseEther, toBn }
