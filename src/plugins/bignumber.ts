import BigNumber from 'bignumber.js'

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN })

type BigNumberInput = string | number | undefined | BigNumber

const toBn = (value: BigNumberInput) => {
  if (!value) {
    return new BigNumber(0)
  }

  return new BigNumber(value)
}

const parseEther = (value: BigNumberInput, decimals: number = 18) => {
  return toBn(value).multipliedBy(toBn(10).pow(decimals))
}

const formatUnits = (value: BigNumberInput, decimals: number = 18, format: boolean = true): string => {
  const bn = toBn(value).dividedBy(toBn(10).pow(decimals))

  let result = '0'
  if (format) {
    result = bn.toFormat(4)

    let reg = /[0]*$/
    result = result.replace(reg, '')

    reg = /[.]*$/
    result = result.replace(reg, '')
  } else {
    result = bn.toFixed(4)
  }

  return result
}

export { formatUnits, parseEther, toBn }
