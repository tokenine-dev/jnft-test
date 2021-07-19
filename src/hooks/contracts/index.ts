import { BigNumber } from 'ethers'
import { useEthersContext } from 'providers/ethers'

export const ApproveAccount = (account: string) => {
  const ethers = useEthersContext()
  console.log(account, ethers)

  return {
    ethers, account
  }
}
