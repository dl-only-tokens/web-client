import { ethers } from 'ethers'

const generateWallet = () => {
  const wallet = ethers.Wallet.createRandom()

  return { address: wallet.address, privateKey: wallet.privateKey }
}

const restoreWalletFromPrivateKey = (privateKey: string) => {
  const wallet = new ethers.Wallet(privateKey)

  return { address: wallet.address, privateKey }
}

const isEtherAddress = (address: string) => {
  return ethers.isAddress(address)
}

export { generateWallet, isEtherAddress, restoreWalletFromPrivateKey }
