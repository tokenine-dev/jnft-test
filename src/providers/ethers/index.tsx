/* 
  Provide initialized Ethers API and Smart Contracts
*/

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { ethers, Contract } from 'ethers';
import { useInterval } from 'hooks/utils'
import { useDAppContext } from 'providers/dapp';
import { safeAddress } from 'utils/contract';
import { initialContracts, abis, setupContract } from 'contracts'

export const EthersContext = createContext<{
  contracts?: any
  account?: string | null | undefined
}>({})

export function useEthersContext() {
  return useContext(EthersContext)
}

export function EthersProvider(props: any) {
  const { children } = props
  const { ethereum, account, chain } = useDAppContext()
  const [ provider, setProvider ] = useState<{} | null>(null)
  const [ signer, setSigner ] = useState<{} | null>(null)
  const [ contracts, setContracts ] = useState<any>({})
  const [ isContractReady, setIsContractReady ] = useState(false)

  const initEthersInterval = useRef("init-ethers-interval")
  const [ initEthersIntervalTime, setInitEthersIntervalTime ] = useState(500)
  const initEthersIntervalTimeRef = useRef(initEthersIntervalTime)

  useEffect(() => {
    // if (ethereum && isUpdate) {
    setIsContractReady(false)
  }, [ ethereum, chain ])
  // }, [ ethereum, chain, isUpdate ])

  useInterval(initEthersInterval, () => {
    if (!isContractReady) {
      initEthers()
    }
  }, initEthersIntervalTimeRef.current)

  function initEthers() {
    // console.log("initEthers")
    if (ethereum) {
      const _provider = new ethers.providers.Web3Provider(ethereum)
      setProvider(_provider)
  
      const _signer = _provider.getSigner()
      setSigner(_signer)
  
      const _contracts = initContracts(_signer)
      
      // console.log("SetContracts", _contracts, ethereum)
      if (Object.keys(_contracts).length > 0) {
        setContracts(_contracts)
        setIsContractReady(true)
        setInitEthersIntervalTime(10000)
      }
    }
  }

  function initContracts ($signer: any, $contracts: any = {}): any {
    const __contracts: any = { }
    // const __contracts = { ...$contracts }

    // if ($contracts) {
    //   // const contractKeys = Object.keys($contracts)
    //   // contractKeys.map(contractKey => {
    //   //   const contract = ($contracts as any)[contractKey]
    //   //   __contracts[contractKey] = new Contract(contract.address, contract.abi, $signer)
    //   // })
    // }

    if (chain.code !== "unknown") {
      Object.entries(initialContracts[chain.code] as any).map(entry => {
        try {
          const [ _address ] = entry
          const address = safeAddress(_address)
          const contracts = setupContract(address)

          if (!contracts[chain.code]) return

          const contract = contracts[chain.code][address]
          if (!__contracts[chain.code]) { __contracts[chain.code] = { } }

          if (!__contracts[chain.code][address]) {
            const ABI = typeof contract.abi === "string" ? (abis as any)[contract.abi] : contract.abi
            __contracts[chain.code][address] = {
                ...contract,
                ...new Contract(contract.address,
                ABI,
                $signer
              ),
              address
            }
            __contracts[contract.code] = __contracts[chain.code][address]
            __contracts[chain.code][contract.code] = __contracts[chain.code][address]
          }
        } catch (error) {
          console.error(error)
        }
      })
    }

    return __contracts
  }
  const value = { provider, signer, contracts, account }

  return <EthersContext.Provider value={value} children={children} />
}
