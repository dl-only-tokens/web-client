import { ethers } from 'ethers'

export const generateWallet = () => {
  const wallet = ethers.Wallet.createRandom()

  return { address: wallet.address, privateKey: wallet.privateKey }
}

export const restoreWalletFromPrivateKey = (privateKey: string) => {
  const wallet = new ethers.Wallet(privateKey)

  return { address: wallet.address, privateKey }
}

export const isEtherAddress = (address: string) => {
  return ethers.utils.isAddress(address)
}

export const stringToBytes = (str: string): string => {
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str))
}

export const getRandomHexString = (): string => {
  return ethers.utils.hexlify(ethers.utils.randomBytes(32))
}

export const zeroAddress = '0x0000000000000000000000000000000000000000'
