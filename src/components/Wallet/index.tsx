import { useDAppContext } from "providers/dapp"
import Loader from "react-loader-spinner"

export const ConnectButton = () => {
  const { isSupportedChain, isConnectible, connect } = useDAppContext()

  const _handleConnectButton = () => {
    if (isSupportedChain && isConnectible) { connect() }
    else { /* TODO: Show Help */ }
  }

  const buttonMessage = (isSupportedChain: boolean | null, isConnectible: boolean): any => {
    if (isSupportedChain === null) {
      return (
        <span className="inline-flex justify-between">
          <span className="mr-2"><Loader type="Circles" color="#FFFFFF" height={24} width={24} /></span>
          {"Please wait..."}
        </span>
      )
    }
    return !isSupportedChain
      ? (
        <span className="inline-flex justify-between">
          <span className="mr-2"><Loader type="Rings" color="#FFFFFF" height={24} width={24} /></span>
          {"Unsupported Chain"}
        </span>
      ) : isConnectible 
        ? (
          <span className="inline-flex justify-between">
            <span className="mr-2"><Loader type="Puff" color="#FFFFFF" height={24} width={24} /></span>
            {"Connect Wallet"}
          </span>
        ) : (
          <span className="inline-flex justify-between">
            <span className="mr-2"><Loader type="RevolvingDot" color="#FFFFFF" height={24} width={24} /></span>
            {"Cannot Connect... Please refresh"}
          </span>
        )
  }

  return (<>
    <button
      onClick={_handleConnectButton}
      className="w-full sm:w-auto inline-flex bg-gray-900 hover:bg-gray-700 text-white textLg leading-6 font-semibold py-3 pr-6 pl-3 border border-transparent rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
    >
      { buttonMessage(isSupportedChain, isConnectible) }
    </button>
    {
      (!isSupportedChain || !isConnectible)
    }
  </>)
}

export const DisconnectButton = () => {
  const { disconnect } = useDAppContext()

  return (
    <button
      onClick={disconnect}
      className="w-full sm:w-auto flex-none bg-gray-900 hover:bg-gray-700 text-white textLg leading-6 font-semibold py-3 px-6 border border-transparent rounded-full focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-900 focus:outline-none transition-colors duration-200"
    >
      Disconnect
    </button>
  )
}

export const FallbackWalletNotConnect = () => {
  return (
      <div className="flex flex-col items-center p-10 pt-4 justify-center text-1xl w-screen" style={{ height: '60vh' }}>
          <div className="label border-opacity-20">
              <h2 className="title">Please connect you account first</h2>
          </div>
          <div className="lg:w-32 mx-auto"><ConnectButton /></div>
      </div>
  )
}
