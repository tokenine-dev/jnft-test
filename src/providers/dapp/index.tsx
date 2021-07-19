/* 
  Provide state and functions necessary for DApp
  like Ethereum Provider Object (window.ethereum), Wallet Address, Connect/Disconnect function

  TODO:
  - Add Reconnection account checking (Implement comparing logic for previous connected account)
  - Add Chain ID Checking
  - Add Multiple Account Checking for MetaMask (Opt-in is still not working for some account that's not connected)
*/

import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useInterval } from 'hooks/utils'
import { EthersProvider } from 'providers/ethers'
import { TransactionsProvider } from 'providers/transactions'
import Debug, { $debug } from 'utils/debug'

export const DAppContext = createContext<{
  isUpdate: boolean
  ethereum: any
  account: string | null
  chain: any
  isSupportedChain: boolean | null
  isConnectible: boolean
  connect: () => void
  disconnect: () => void
}>({} as any)

export function useDAppContext() {
  return useContext(DAppContext)
}
interface IChainInfo {
  int: number | null | undefined
  hex: string | null | undefined
  dec: string | null | undefined
  name: string
  code: string
  testnet: boolean
}

const DAppProvider = (props: any) => {
  console.log("DAppProvider", (window as any)?.ethereum?.chainId)
  const [ isUpdate, setIsUpdate ] = useState(true)
  const [ ethereum, setEthereum ] = useState((window as any).ethereum)
  const [ account, setAccount ] = useState< string | null >(null)
  const [ chain, setChain ] = useState<any>(chainIdResolver((window as any)?.ethereum?.chainId))
  const [ isSupportedChain, setSupportedChain ] = useState< boolean | null>(null)
  const [ isConnectible, setConnectible ] = useState(true)
  const [ reconnectCount, setReconnectCount ] = useState(0)
  
  const [ chainDetectorIntervalTime, setChainDetectorIntervalTime ] = useState(3000)
  const [ chainDetectorIntervalCount, setChainDetectorIntervalCount ] = useState(0)
  const chainDetectorIntervalTimeRef = useRef(chainDetectorIntervalTime)
  
  const [ reconnectIntervalTime, setReconnectIntervalTime ] = useState(1000)
  const reconnectIntervalTimeRef = useRef(reconnectIntervalTime)
  
  const reconnectInterval = useRef("reconnector-interval")
  const chainDetectorInterval = useRef("chaindetector-interval")
  
  const _recentConnectedAccount = localStorage.getItem("_rc")

  console.log("Account in DAppProvider", account)
  
  const handleConnect = (from?: string) => {
    console.log("handleConnect - check ethereum")
    if (ethereum) {
      console.log("handleConnect - check isSupportedChain", isSupportedChain)
      if (isSupportedChain) { 
        console.log("connecting")
        ethereum.request({
          method: "eth_requestAccounts",
        })
        .then((accounts: string[]) => {
          const _account = accounts[0]
          if (_account) {
            setAccount(_account)
            const now = new Date().getTime()
            const _accountLast4Character = _account.substr(_account.length - 4, 4)
            const _recent = now.toString() + "/" + _accountLast4Character
            localStorage.setItem("_rc", _recent)
            console.log("connected")
          } else {
            /* 
              TODO: Show some alert 
            */
          }
          clearInterval(parseInt(reconnectInterval.current))
          setReconnectCount(0)
        })
      } else {
        if (from !== 'reconnect') {
          /* 
            TODO: Improve UI
          */
          alert("This chain is not support for now")
        }
        clearInterval(parseInt(reconnectInterval.current))
        setReconnectCount(0)
      }
    }
  }

  const handleDisconnect = (type?: string) => {
    setAccount(null)
    if (type !== "temp") {
      localStorage.removeItem("_rc")
    }
  }

  const _handleReconnect = () => {
    console.log("_handleReconnect", account, _recentConnectedAccount)
    if (_recentConnectedAccount && !account) {
      const [_lastConnect/*,  _account */] = _recentConnectedAccount.split("/")
      const now = new Date().getTime()
      const diff = now - parseInt(_lastConnect)
      console.log("try reconnecting in...", diff)
      if (diff <= (15 * 60 * 1000)) {
        console.log("reconnecting")
        handleConnect("reconnect")
        setReconnectCount(reconnectCount + 1)
        if (reconnectCount < 20) {
        }
      }
    }
  }

  const _handleChainChanging = () => {
    const _chain = chainIdResolver((window as any)?.ethereum?.chainId)
    const _isSupportedChain = isSupportedChainChecker(_chain)
    console.log("_handleChainChanging - isUpdate", isUpdate, "same chain", chain.int === _chain.int)
    
    if (chain.int !== _chain.int) {
      // console.log("_handleChainChanging", chain, _chain)
      handleDisconnect("temp")
      setSupportedChain(_isSupportedChain)

      if (_isSupportedChain) {
        _handleReconnect()
        // console.log("current chain", chain.code, "detected chain", _chain.code)
        // if (chain.int !== _chain.int || !chain) {
          // console.log("Chain network changed")
          const baseIntervalDuration = 100
          const maxIntervalDuration = 10000 // Use this for too much re-rendering prevention
          // if (chainDetectorIntervalCount > 5) {
          //   setSupportedChain(_isSupportedChain)
          //   // setIsUpdate(true)
          // }
        
          if (_isSupportedChain) {
            setChain(_chain)
            setConnectible(_isSupportedChain)
        
            const _chainDetectorIntervalCount = chainDetectorIntervalCount * baseIntervalDuration
            const properIntervalTime =  _chainDetectorIntervalCount <= maxIntervalDuration ? _chainDetectorIntervalCount : maxIntervalDuration
            setChainDetectorIntervalTime(properIntervalTime)
            setChainDetectorIntervalCount(chainDetectorIntervalCount + 1)
            
            // Timeout => force disconnect
            if (chainDetectorIntervalCount > (maxIntervalDuration / baseIntervalDuration)) {
              handleDisconnect()
              setChainDetectorIntervalCount(0)
              return
            }
        
            if (!account) {
              _handleReconnect()
              return
            } else {
              setChainDetectorIntervalTime(5000)
            }
        
          } else {
            setConnectible(_isSupportedChain)
            setSupportedChain(_isSupportedChain)
            setChainDetectorIntervalTime(1000)
            if (chainDetectorIntervalCount > 20) {
              handleDisconnect()
              setChainDetectorIntervalCount(0)
            }
          }
      }

      setIsUpdate(false)
      // }
    }
  }

  useEffect(() => {
    (window as any)?.ethereum?.on('accountsChanged', (accounts: string[]) => {
      console.log("Account changed", accounts)
      setAccount(accounts[0])
    });
  })

  useEffect(() => {
    console.log("useEffect - window.ethereum")
    setEthereum((window as any).ethereum)
    // setIsUpdate(false)
  }, [(window as any).ethereum])

  useEffect(() => {
    console.log("useEffect - chainId")
    const _chain = chainIdResolver((window as any)?.ethereum?.chainId)
    const _isSupportedChain = isSupportedChainChecker(_chain)
    console.log("Chain Checking", _chain.code, "supported", _isSupportedChain)
    setChain(_chain)
    setSupportedChain(_isSupportedChain)
    // setConnectible(_isSupportedChain)
    setIsUpdate(false)
  }, [(window as any)?.ethereum?.chainId, chain.int])

  useInterval(reconnectInterval, () => {
    console.log("useInterval - reconnectInterval")
    _handleReconnect()
    if (isUpdate) {
      console.log("setIsUpdate - false")
      setIsUpdate(false)
    }
  }, reconnectIntervalTimeRef.current)
  
  useInterval(chainDetectorInterval, () => {
    console.log("useInterval - chainDetectorInterval")
    _handleChainChanging()
    if (isUpdate) {
      console.log("setIsUpdate - false")
      setIsUpdate(false)
    }
  }, chainDetectorIntervalTimeRef.current)

  const value = { ethereum, account, chain, isSupportedChain, isConnectible, isUpdate, connect: handleConnect, disconnect: handleDisconnect }

  return (
    <DAppContext.Provider value={value}>
      {/* <EthersProvider dapp={{ ethereum, account, chain, isUpdate }}> */}
      <EthersProvider>
        <TransactionsProvider children={ props.children } />
      </EthersProvider>
    </DAppContext.Provider>
  )
}

export default DAppProvider

function chainIdResolver (_chainId: string | number = ""): IChainInfo {
  let hex, dec, int, name = "unknown", code = "unknown", testnet = true;
  const chainId = `${_chainId}`
  if (chainId) {
    if (chainId.includes("0x")) {
      int = parseInt(chainId, 16)
      hex = chainId.toString()
      dec = int.toString()
    } else {
      int = parseInt(chainId)
      hex = _chainId && _chainId.toString(16)
      dec = _chainId && _chainId.toString()
    }
  }

  switch (hex) {
    case '0x61':
      name = "BSC Testnet"
      code = "bsc-testnet"
      break
    default:
  }
  // @ts-ignore
  return { name, int, hex, dec, code, testnet }
}

function isSupportedChainChecker (chain: IChainInfo): boolean {
  const chainSupportList = ["0x61", "bsc-testnet"]
  if (
    (chain.hex && chainSupportList.includes(chain.hex))
    || (chain.code && chainSupportList.includes(chain.code)) 
  ) {
    return true
  }
  return false
}
