import { useState, useEffect, ChangeEvent } from 'react'
import { useDAppContext } from 'providers/dapp'
import { useEthersContext } from 'providers/ethers'

import { BigNumber } from 'ethers'

export const DebugSmartContract = () => {
    const { account, chain } = useDAppContext()
    const { contracts } = useEthersContext()
    
    const [ isUpdate, setIsUpdate ] = useState(false)

    return (
        <div>
            Debug Smart Contract
            <div>
                <div>Account: {account}</div>
                <div>Chain ID: { chain && (`${chain.int} (${chain.name})`) }</div>
                {
                    Object.keys(contracts).map((k, i) => {
                        const contract = contracts[k]
                        return (
                            <div key={k}>{k}: {contract.address}</div>
                        )
                    })
                }
            </div>
            <ArtworkContract />
            <BidContract />
            <FlowSetQuoteToken handlers={ { isUpdate, setIsUpdate } } />
            <FlowMinting />
            <FlowApproveForAll />
            <FlowCheckUsersWork />
            <FlowSetSelling />
            <FlowSetCurrentPrice />
            <FlowCancelSelling />
            {/* <FlowApprove /> */}
            <FlowApproveCurrencyToken />
            <FlowBuy />
            {/* <FlowSetAuction /> */}
            <FlowBid />
            <FlowUpdateBidPrice />
            <FlowCancelBid />
        </div>
    )
}

/* 

*/
const ArtworkContract = () => {
    const { contracts } = useEthersContext()
    const { artWork: ARTWORK } = contracts

    return (
        ARTWORK ? (
            <Accordion title="[Smart Contract] Artwork">
                <div id="debug-artwork-smartcontract debug-panel">
                    <h1>Artwork Contract interface</h1>
                    <div>{Object.keys(ARTWORK).map((k, i) => (<ContractProp key={k + ":" + i} k={k} contract={ARTWORK} />))}</div>
                </div>
            </Accordion>
        ) : (
            <div id="debug-artwork-smartcontract debug-panel">
                <div>Artwork Contract is not available</div>
            </div>
        )
    )
}


/* 

*/
const BidContract = () => {
    const { contracts } = useEthersContext()
    const { bid: BID } = contracts

    return (
        BID ? (
            <Accordion title="[Smart Contract] Bid">
                <div id="debug-panel debug-artwork-smartcontract ">
                    <h1>Bid Contract interface</h1>
                    <div>{Object.keys(BID).map((k, i) => (<ContractProp key={k + ":" + i} k={k} contract={BID} />))}</div>
                </div>
            </Accordion>
        ) : (
            <div id="debug-panel debug-artwork-smartcontract">
                <div>Bid Contract is not available</div>
            </div>
        )
    )
}

/* 

*/
const FlowSetQuoteToken = (props: any) => {
    const { account } = useDAppContext()
    const { contracts } = useEthersContext()
    const { artWork: ARTWORK, bid: BID } = contracts

    const { handlers } = props
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const [ supportQuoteTokens, setSupportQuoteTokens ] = useState<any>([])
    const [ quoteTokenInput, setQuoteTokenInput ] = useState("")

    const tokenURI = "https://www.google.comm"
    const data = { account, ARTWORK, BID, quoteTokenInput }
    const { setIsUpdate } = handlers

    const getSupportedQuoteTokens = async () => {
        try {
            const _result = await BID.getSupportedQuoteTokens()
            setSupportQuoteTokens(_result)
            return _result
        } catch (error) {
            setError(error)
        }
    }

    useEffect(() => {
        (async () => {
            if (supportQuoteTokens.length === 0) {
                await getSupportedQuoteTokens()
                setIsUpdate(false)
            }
        })()
    // })
    })

    return (
        <Accordion title="[FLOW] Support Quote Tokens (Only Admin (Deployer))">
            <div className="debug-panel">
                <div>
                    <h5>Support Quote Tokens getSupportedQuoteTokens()</h5>
                    <div>
                        {
                            supportQuoteTokens.length > 0 && supportQuoteTokens.map((v: any) => (<li key={v}>{v}</li>))
                        }
                    </div>
                    <div className="_panels">
                        <label>Add Quote (Currency) Token</label>
                        <input
                            onChange={(e) => { setQuoteTokenInput(e.target.value) }}
                            required
                            placeholder={`Add new currency token address`}
                            type="text"
                        />
                    </div>
                    <div className="_panels">
                        <button className="_btn" onClick={() => handleSetSupportQuoteToken(setError, setResult, data, handlers)}>Set Support Quote Tokens</button>
                    </div>
                </div>
                { result && (<>
                    <div className="_panels">
                        <h5>Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {/* {
                    error && (<>
                        <div className="_panels _error-panel">
                            <h5>Error</h5>
                            { JSON.stringify(error) }
                            <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                        </div>
                    </>)
                } */}
            </div>
        </Accordion>
    )
}

/* 

*/
export const handleSetSupportQuoteToken = async (setError: any, setResult: any, data?: any, handlers?: any) => {
    const { account, BID, quoteTokenInput } = data
    // const { setIsUpdate } = handlers

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!quoteTokenInput) { throw { message: "Invalid quote token input" } }

        const resultTx = await BID.addSupportedQuoteToken(quoteTokenInput)
        console.log(resultTx)
        setError(null)
        setResult(resultTx)
        // setIsUpdate(true)

    } catch (error) {
        setResult(null)
        setError(error)
    }
}

/* 

*/
const FlowMinting = () => {
    const { account } = useDAppContext()
    const { contracts } = useEthersContext()
    const { artWork: ARTWORK, bid: BID } = contracts
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const tokenURI = "https://www.google.comm"
    const data = { account, tokenURI, ARTWORK }

    return (
        <Accordion title="[FLOW] Minting">
            <div className="debug-panel">
                <div>
                    <h5>Mint</h5>
                    <div>
                        <button className="_btn" onClick={() => handleMint(setError, setResult, data)}>Mint</button>
                    </div>
                </div>
                { result && (<>
                    <div className="_panels">
                        <h5>Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {/* {
                    error && (<>
                        <div className="_panels _error-panel">
                            <h5>Error</h5>
                            { JSON.stringify(error) }
                            <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                        </div>
                    </>)
                } */}
            </div>
        </Accordion>
    )
}

/* 

*/
export const handleMint = async (setError: any, setResult: any, data?: any) => {
    const { account, tokenURI, ARTWORK } = data

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!tokenURI) { throw { message: "Invalid token URI" } }

        const resultMintTx = await ARTWORK.mint(
            account,
            tokenURI,
            {
                value: 1500000000000000,
                gasLimit: 1500000,
            }
        )
        setError(null)
        setResult(resultMintTx)
    } catch (error) {
        setResult(null)
        setError(error)
    }
}

/* 

*/
const FlowApproveForAll = () => {
    const { account } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const data = { account, contracts }

    return (
        <Accordion title="[FLOW] Approve for All">
            <div className="debug-panel">
                <div>
                    <h5>Approve for All</h5>
                    <div>
                        <button className="_btn" onClick={() => handleSetApprovalForAll(setError, setResult, data)}>Submit</button>
                    </div>
                </div>
                { result && (<>
                    <div className="_panels _result-panel">
                        <h5>Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {/* {
                    error && (<>
                        <div className="_panels _error-panel">
                            <h5>Error</h5>
                            { JSON.stringify(error) }
                            <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                        </div>
                    </>)
                } */}
            </div>
        </Accordion>
    )
}

/* 

*/
export const handleSetApprovalForAll = async (setError: any, setResult: any, data?: any) => {
    const { account, contracts } = data
    const { artWork: ARTWORK, bid: BID } = contracts

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!ARTWORK) { throw { message: "Artwork contract not available" } }
        if (!BID) { throw { message: "Bid contract not available" } }

        const resultTx = await ARTWORK.setApprovalForAll(
            BID.address, true
        )
        setError(null)
        setResult(resultTx)
    } catch (error) {
        setResult(null)
        setError(error)
    }
}

/* 

*/
const FlowSetSelling = () => {
    const { account = "0x0" } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const { artWork: ARTWORK } = contracts

    // const { currencies } = contracts
    const currencies = {
        "WBNB": "0xae13d989dac2f0debff460ac112a837c89baa7cd",
        "JFIN": "0x1df0672a4553090573ffc1260f4e9fca8575d366",
    }

    const [ artworkTokenId, setArtworkTokenId ] = useState(1)
    const [ artworkTokenOwner, setArtworkTokenOwner ] = useState("")
    const [ price, setPrice ] = useState(0)
    const [ currencyToken, setCurrencyToken ] = useState("WBNB")

    const _account = account ? (account as string).toLowerCase() : ""
    const resolvedCurrencyAddress = currencies && (currencies as any)[currencyToken]

    const data = { account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken: resolvedCurrencyAddress }

    const getArtworkOwner = async (artworkTokenId: number) => {
        try {
            if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
            const _result = await ARTWORK.ownerOf(artworkTokenId)
            setArtworkTokenOwner(_result)
            setResult(_result)
            setError(null)
            return _result
        } catch (error) {
            setResult(null)
            setError(error)
        }
        
    }

    const handleOnChangeArtworkTokenIdInput = ({ target }: any) => {
        if (target.value > 0) {
            setArtworkTokenId(target.value)
            getArtworkOwner(artworkTokenId).then()
        }
    }

    const handleOnChangePriceInput = ({ target }: any) => {
        if (target.value > 0) { setPrice(target.value) }
    }

    const handleChangeCurrency = (event: ChangeEvent<HTMLSelectElement>) => {
        setCurrencyToken(event.target.value)
    }
    useEffect(() => {
        (async () => {
            await getArtworkOwner(artworkTokenId)
        })()
    }, [ artworkTokenId ] )

    return (
        <Accordion title="[FLOW] Set Selling">
            <div className="debug-panel">
                <div>
                    <h5>Set Ready to Sell</h5>
                    <div>
                        <div>Artwork Owner: {artworkTokenOwner}
                            <span className="text-danger">{(artworkTokenOwner).toLowerCase() !== _account && " This account is not an owner" }</span>
                        </div>

                        <div>Selected Currency Token: {currencyToken} ({(currencies as any)[currencyToken]})</div>

                        <label>Artwork Token Id</label>
                        <input
                            onChange={handleOnChangeArtworkTokenIdInput}
                            required
                            placeholder={`${artworkTokenId}`}
                            type="number"
                            min={1}
                        />


                        <label>Price</label>
                        <input
                            onChange={handleOnChangePriceInput}
                            required
                            placeholder={`${price}`}
                            type="number"
                            min={1}
                        />

                        <label>Currencies</label>
                        <select
                            id="formGridState"
                            value={currencyToken}
                            onChange={handleChangeCurrency}
                        >
                            {
                                Object.keys(currencies).map(k => <option key={k} value={k}>{ `${k} (${(currencies as any)[k]})`}</option>)
                            }
                        </select>
                    </div>
                    <div>
                        <button className="_btn" onClick={() => handleSetReadyToSell(setError, setResult, data)}>Submit</button>
                    </div>
                </div>
                { result && (<>
                    <div className="_panels _result-panel">
                        <h5>Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {/* {
                    error && (<>
                        <div className="_panels _error-panel">
                            <h5>Error</h5>
                            { JSON.stringify(error) }
                            <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                        </div>
                    </>)
                } */}
            </div>
        </Accordion>
    )
}

/* 

*/
export const handleSetReadyToSell = async (setError: any, setResult: any, data?: any) => {
    const { account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken } = data
    const { artWork: ARTWORK, bid: BID } = contracts

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!ARTWORK) { throw { message: "Artwork contract not available" } }
        if (!BID) { throw { message: "Bid contract not available" } }
        if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
        if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }
        if (!price) { throw { message: "Invalid price" } }
        if (!currencyToken) { throw { message: "Invalid currency token" } }
        console.log(currencyToken)

        const resultTx = await BID.readyToSellToken(
            artworkTokenId,
            price,
            currencyToken
        )

        setError(null)
        setResult(resultTx)
    } catch (error) {
        setResult(null)
        setError(error)
    }
}

/* 
 */
const FlowCheckUsersWork = () => {

    const { account = "0x0" } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const [ walletAddress, setWalletAddress ] = useState("")
    const { artWork: ARTWORK, bid: BID } = contracts

    const [ asksByUser, setAsksByUser ] = useState<any>([])
    // const [ artworkTokenOwner, setArtworkTokenOwner ] = useState("")

    // const _account = account ? (account as string).toLowerCase() : ""

    // const data = { account, contracts }

    // const handleOnChangeArtworkTokenIdInput = ({ target }: any) => {
    //     if (target.value > 0) {
    //         setArtworkTokenId(target.value)
    //         getArtworkOwner(artworkTokenId).then()
    //     }
    // }

    const getAsksByUser = async () => {
        try {
            const _address = walletAddress === "" ? account : walletAddress 
            const _result = await BID.getAsksByUser(_address)
            console.log(_result)
            // setAsksByUser(_result)
            return _result
        } catch (error) {
            setError(error)
        }
    }

    const handleOnChangeWalletAddressInput = (event: any) => {
        setWalletAddress(event.target.value)
    }

    // useEffect(() => {
    //     (async () => {
    //         try {
    //             const result = await getAsksByUser(account)
    //             // console.log(result)
    //             // console.log("FlowCheckUsersWork: useEffect", result)
    //             setAsksByUser(result)
    //         } catch (error) {
    //             setError(error)
    //             // console.log(error)
    //         }
    //     })()
    // }, [ account, asksByUser ] )

    return (
        <Accordion title="[FLOW] Check User's Work">
            <div className="debug-panel">
                <div>
                    <h5>Get Ask by User getAsksByUser(address user))</h5>
                    <div>
                        {
                            asksByUser.length > 0 
                            ? asksByUser.map((k: any) => {
                                return (
                                    <div key={k}>{ k }</div>
                                )
                            })
                            : "" 
                        }
                        {/* <div>Artwork Owner: {artworkTokenOwner}
                            <span className="text-danger">{(artworkTokenOwner).toLowerCase() !== _account && " This account is not an owner" }</span>
                        </div> */}

                        <label>Wallet Address</label>
                        <input
                            onChange={handleOnChangeWalletAddressInput}
                            // placeholder={`${artworkTokenId}`}
                            type="text"
                        />

                    </div>
                    <div>
                        <button className="_btn" onClick={getAsksByUser}>Get User's Works</button>
                    </div>
                </div>
                { result && (<>
                    <div>
                        <h5 className="_panels _result-panel">Result</h5>
                        { JSON.stringify(result) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {/* {
                    error && (<>
                        <div className="_panels _error-panel">
                            <h5>Error</h5>
                            { JSON.stringify(error) }
                            <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                        </div>
                    </>)
                } */}
            </div>
        </Accordion>
    )
}

/* 

 */
// export const handleGetAsksByUser = async (setError: any, setResult: any, data?: any, handlers?: any) => {
//     const { account, contracts, artworkTokenId } = data
//     const { bid: BID } = contracts
//     console.log(BID)

//     try {
//         if (!account) { throw { message: "Account is not available to create a new work" } }
//         if (!BID) { throw { message: "Bid contract not available" } }
//         if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
//         // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }

//         const resultTx = await BID.cancelSellToken(
//             artworkTokenId
//         )
//         console.log(resultTx)

//         setError(null)
//         setResult(resultTx)
//     } catch (error) {
//         setResult(null)
//         setError(error)
//     }
// }


/* 

 */
const FlowCancelSelling = () => {

    const { account = "0x0" } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const { artWork: ARTWORK } = contracts

    const [ artworkTokenId, setArtworkTokenId ] = useState(1)
    const [ artworkTokenOwner, setArtworkTokenOwner ] = useState("")

    const _account = account ? (account as string).toLowerCase() : ""

    const data = { account, contracts, artworkTokenId, artworkTokenOwner }

    const handleOnChangeArtworkTokenIdInput = ({ target }: any) => {
        if (target.value > 0) {
            setArtworkTokenId(target.value)
            getArtworkOwner(artworkTokenId).then()
        }
    }

    const getArtworkOwner = async (artworkTokenId: number) => {
        try {
            if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
            const _result = await ARTWORK.ownerOf(artworkTokenId)
            setArtworkTokenOwner(_result)
            setResult(_result)
            setError(null)
            return _result
        } catch (error) {
            setResult(null)
            setError(error)
        }
    }

    useEffect(() => {
        (async () => {
            await getArtworkOwner(artworkTokenId)
        })()
    }, [ artworkTokenId ] )

    return (
        <Accordion title="[FLOW] Cancel Selling">
            <div className="debug-panel">
                <div>
                    <h5>Set Ready to Sell</h5>
                    <div>
                        <div>Artwork Owner: {artworkTokenOwner}
                            <span className="text-danger">{(artworkTokenOwner).toLowerCase() !== _account && " This account is not an owner" }</span>
                        </div>

                        <label>Artwork Token Id</label>
                        <input
                            onChange={handleOnChangeArtworkTokenIdInput}
                            required
                            placeholder={`${artworkTokenId}`}
                            type="number"
                            min={1}
                        />

                    </div>
                    <div>
                        <button className="_btn" onClick={() => handleCancelSelling(setError, setResult, data)}>Submit</button>
                    </div>
                </div>
                { result && (<>
                    <div>
                        <h5 className="_panels _result-panel">Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {/* {
                    error && (<>
                        <div className="_panels _error-panel">
                            <h5>Error</h5>
                            { JSON.stringify(error) }
                            <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                        </div>
                    </>)
                } */}
            </div>
        </Accordion>
    )
}

/* 

 */
export const handleCancelSelling = async (setError: any, setResult: any, data?: any, handlers?: any) => {
    const { account, contracts, artworkTokenId } = data
    const { bid: BID } = contracts
    console.log(BID)

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!BID) { throw { message: "Bid contract not available" } }
        if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }

        const resultTx = await BID.cancelSellToken(
            artworkTokenId
        )
        console.log(resultTx)

        setError(null)
        setResult(resultTx)
    } catch (error) {
        setResult(null)
        setError(error)
    }
}

/* 
 */
const FlowCancelBid = () => {

    const { account = "0x0" } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const { artWork: ARTWORK } = contracts

    const [ artworkTokenId, setArtworkTokenId ] = useState(1)
    const [ artworkTokenOwner, setArtworkTokenOwner ] = useState("")

    const _account = account ? (account as string).toLowerCase() : ""

    const data = { account, contracts, artworkTokenId, artworkTokenOwner }

    const handleOnChangeArtworkTokenIdInput = ({ target }: any) => {
        if (target.value > 0) {
            setArtworkTokenId(target.value)
            getArtworkOwner(artworkTokenId).then()
        }
    }

    const getArtworkOwner = async (artworkTokenId: number) => {
        try {
            if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
            const _result = await ARTWORK.ownerOf(artworkTokenId)
            setArtworkTokenOwner(_result)
            setResult(_result)
            setError(null)
            return _result
        } catch (error) {
            setResult(null)
            setError(error)
        }
    }

    useEffect(() => {
        (async () => {
            await getArtworkOwner(artworkTokenId)
        })()
    }, [ artworkTokenId ] )

    return (
        <Accordion title="[FLOW] Cancel Bid (Only Buyer)">
            <div className="debug-panel">
                <div>
                    <h5>Cancel Bid Token cancelBidToken(uint256 _tokenId)</h5>
                    <div>
                        <div>Artwork Owner: {artworkTokenOwner}
                            <span className="text-danger">{(artworkTokenOwner).toLowerCase() !== _account && " This account is not an owner" }</span>
                        </div>

                        <label>Artwork Token Id</label>
                        <input
                            onChange={handleOnChangeArtworkTokenIdInput}
                            required
                            placeholder={`${artworkTokenId}`}
                            type="number"
                            min={1}
                        />

                    </div>
                    <div>
                        <button className="_btn" onClick={() => handleCancelBid(setError, setResult, data)}>Submit</button>
                    </div>
                </div>
                { result && (<>
                    <div>
                        <h5 className="_panels _result-panel">Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {/* {
                    error && (<>
                        <div className="_panels _error-panel">
                            <h5>Error</h5>
                            { JSON.stringify(error) }
                            <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                        </div>
                    </>)
                } */}
            </div>
        </Accordion>
    )
}

/* 

 */
export const handleCancelBid = async (setError: any, setResult: any, data?: any, handlers?: any) => {
    const { account, contracts, artworkTokenId } = data
    const { bid: BID } = contracts
    console.log(BID)

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!BID) { throw { message: "Bid contract not available" } }
        if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }

        const resultTx = await BID.cancelBidToken(
            artworkTokenId
        )
        console.log(resultTx)

        setError(null)
        setResult(resultTx)
    } catch (error) {
        setResult(null)
        setError(error)
    }
}


/* 

 */
const FlowSetCurrentPrice = () => {
    const { account = "0x0" } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const { artWork: ARTWORK } = contracts

    // const { currencies } = contracts
    const currencies = {
        "WBNB": "0xae13d989dac2f0debff460ac112a837c89baa7cd",
        "JFIN": "0x1df0672a4553090573ffc1260f4e9fca8575d366",
    }

    const [ artworkTokenId, setArtworkTokenId ] = useState(1)
    const [ artworkTokenOwner, setArtworkTokenOwner ] = useState("")
    const [ price, setPrice ] = useState(0)
    const [ currencyToken, setCurrencyToken ] = useState("WBNB")

    const _account = account ? (account as string).toLowerCase() : ""
    const resolvedCurrencyAddress = currencies && (currencies as any)[currencyToken]

    const data = { account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken: resolvedCurrencyAddress }

    const handleOnChangeArtworkTokenIdInput = ({ target }: any) => {
        if (target.value > 0) {
            setArtworkTokenId(target.value)
            getArtworkOwner(artworkTokenId).then()
        }
    }

    const handleOnChangePriceInput = ({ target }: any) => {
        if (target.value > 0) { setPrice(target.value) }
    }

    const handleChangeCurrency = (event: ChangeEvent<HTMLSelectElement>) => {
        setCurrencyToken(event.target.value)
    }

    const getArtworkOwner = async (artworkTokenId: number) => {
        try {
            if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
            const _result = await ARTWORK.ownerOf(artworkTokenId)
            setArtworkTokenOwner(_result)
            setResult(_result)
            setError(null)
            return _result
        } catch (error) {
            setResult(null)
            setError(error)
        }
    }

    useEffect(() => {
        (async () => {
            await getArtworkOwner(artworkTokenId)
        })()
    }, [ artworkTokenId ] )

    return (
        <Accordion title="[FLOW] Set Current Price">
            <div className="debug-panel">
                <div>
                    <h5>Set Current Price</h5>
                    <div className="_requirement-panel">
                        Require:
                            - Set Selling step before using this flow.
                    </div>
                    <div>
                        <div>Artwork Owner: {artworkTokenOwner}
                            <span className="text-danger">{(artworkTokenOwner).toLowerCase() !== _account && " This account is not an owner" }</span>
                        </div>

                        <div>Selected Currency Token: {currencyToken} ({(currencies as any)[currencyToken]})</div>

                        <label>Artwork Token Id: </label>
                        <input
                            onChange={handleOnChangeArtworkTokenIdInput}
                            required
                            placeholder={`${artworkTokenId}`}
                            type="number"
                            min={1}
                        />


                        <label>Price: </label>
                        <input
                            onChange={handleOnChangePriceInput}
                            required
                            placeholder={`${price}`}
                            type="number"
                            min={1}
                        />

                        <label>Currencies: </label>
                        <select
                            id="formGridState"
                            value={currencyToken}
                            onChange={handleChangeCurrency}
                        >
                            {
                                Object.keys(currencies).map(k => <option key={k} value={k}>{ `${k} (${(currencies as any)[k]})`}</option>)
                            }
                        </select>
                    </div>
                    <div className="_panels _action-panel">
                        <button className="_btn" onClick={() => handleSetCurrentPrice(setError, setResult, data)}>Submit</button>
                    </div>
                </div>
                { result && (<>
                    <div>
                        <h5>Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {/* {
                    error && (<>
                        <div className="_panels _error-panel">
                            <h5>Error</h5>
                            { JSON.stringify(error) }
                            <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                        </div>
                    </>)
                } */}
            </div>
        </Accordion>
    )
}

/* 

 */
export const handleSetCurrentPrice = async (setError: any, setResult: any, data?: any, handlers?: any) => {
    const { account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken } = data
    const { artWork: ARTWORK, bid: BID } = contracts

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!ARTWORK) { throw { message: "Artwork contract not available" } }
        if (!BID) { throw { message: "Bid contract not available" } }
        if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }
        if (!price) { throw { message: "Invalid price" } }
        if (!currencyToken) { throw { message: "Invalid currency token" } }

        const resultTx = await BID.setCurrentPrice(
            artworkTokenId,
            price,
            currencyToken
        )

        setError(null)
        setResult(resultTx)
    } catch (error) {
        setResult(null)
        setError(error)
    }
}


/* 

*/

const FlowApprove = () => {
    const { account = "0x0" } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    // const { artWork: ARTWORK } = contracts
    const [ currencyAmount, setCurrencyAmount ] = useState(0)
    const [ currencyToken, setCurrencyToken ] = useState("WBNB")

    const handleOnChangeCurrencyInput = ({ target }: any) => {
        if (target.value > 0) { setCurrencyAmount(target.value) }
    }


    const handleChangeCurrency = (event: ChangeEvent<HTMLSelectElement>) => {
        setCurrencyToken(event.target.value)
    }

    const data = { account, contracts, currencyAmount, currencyToken }

    return (
        <Accordion title="[FLOW] Approve">
            <div className="debug-panel">
                <div>
                    <h5>Approve</h5>
                    <div className="_requirement-panel">
                        {/* Require:
                            - Set Selling step before using this flow. */}
                    </div>
                    <div>
                        {/* <div>Artwork Owner: {artworkTokenOwner}
                            <span className="text-danger">{(artworkTokenOwner).toLowerCase() !== _account && " This account is not an owner" }</span>
                        </div>

                        <div>Selected Currency Token: {currencyToken} ({(currencies as any)[currencyToken]})</div>

                        <label>Artwork Token Id: </label>
                        <input
                            onChange={handleOnChangeArtworkTokenIdInput}
                            required
                            placeholder={`${artworkTokenId}`}
                            type="number"
                            min={1}
                        />


                        <label>Price: </label>
                        <input
                            onChange={handleOnChangePriceInput}
                            required
                            placeholder={`${price}`}
                            type="number"
                            min={1}
                        />

                        <label>Currencies: </label>
                        <select
                            id="formGridState"
                            value={currencyToken}
                            onChange={handleChangeCurrency}
                        >
                            {
                                Object.keys(currencies).map(k => <option key={k} value={k}>{ `${k} (${(currencies as any)[k]})`}</option>)
                            }
                        </select> */}
                    </div>
                    <div className="_panels _action-panel">
                        <button className="_btn" onClick={() => handleApprove(setError, setResult, data)}>Submit</button>
                    </div>
                </div>
                { result && (<>
                    <div>
                        <h5>Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
            </div>
        </Accordion>
    )
}

/* 

*/
export const handleApprove = async (setError: any, setResult: any, data?: any) => {
    const { account, contracts, currencyToken } = data
    const { artWork: ARTWORK, bid: BID } = contracts

    try {
        // if (!account) { throw { message: "Account is not available to create a new work" } }
        // if (!ARTWORK) { throw { message: "Artwork contract not available" } }
        // if (!BID) { throw { message: "Bid contract not available" } }
        
        const resultTx = await ARTWORK.approve(
            BID.address, 
        )
        setError(null)
        setResult(resultTx)
    } catch (error) {
        setResult(null)
        setError(error)
    }
}

const FlowBuy = () => {
    const { account = "0x0" } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const { artWork: ARTWORK } = contracts

    // const { currencies } = contracts
    const currencies = {
        "WBNB": "0xae13d989dac2f0debff460ac112a837c89baa7cd",
        "JFIN": "0x1df0672a4553090573ffc1260f4e9fca8575d366",
    }

    const [ artworkTokenId, setArtworkTokenId ] = useState(1)
    const [ artworkTokenOwner, setArtworkTokenOwner ] = useState("")
    const [ price, setPrice ] = useState(0)
    const [ currencyToken, setCurrencyToken ] = useState("WBNB")

    const _account = account ? (account as string).toLowerCase() : ""
    const resolvedCurrencyAddress = currencies && (currencies as any)[currencyToken]

    const data = { account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken: resolvedCurrencyAddress }

    const handleOnChangeArtworkTokenIdInput = ({ target }: any) => {
        if (target.value > 0) {
            setArtworkTokenId(target.value)
            getArtworkOwner(artworkTokenId).then()
        }
    }

    const handleOnChangePriceInput = ({ target }: any) => {
        if (target.value > 0) { setPrice(target.value) }
    }

    const handleChangeCurrency = (event: ChangeEvent<HTMLSelectElement>) => {
        setCurrencyToken(event.target.value)
    }

    const getArtworkOwner = async (artworkTokenId: number) => {
        try {
            if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
            const _result = await ARTWORK.ownerOf(artworkTokenId)
            setArtworkTokenOwner(_result)
            setResult(_result)
            setError(null)
            return _result
        } catch (error) {
            setResult(null)
            setError(error)
        }
    }

    useEffect(() => {
        (async () => {
            await getArtworkOwner(artworkTokenId)
        })()
    }, [ artworkTokenId ] )

    return (
        <Accordion title="[FLOW] Buy Work (Only Buyer)">
            <div className="debug-panel">
                <div>
                    <h5>Buy Token (buyToken(tokenId)</h5>
                    <div className="_requirement-panel">
                        Require:
                            - Must not be seller
                    </div>
                    <div>
                        <div>Artwork Owner: {artworkTokenOwner}
                            <span className="text-danger">{(artworkTokenOwner).toLowerCase() === _account && " This account is an owner" }</span>
                        </div>

                        {/* <div>Selected Currency Token: {currencyToken} ({(currencies as any)[currencyToken]})</div> */}

                        <label>Artwork Token Id: </label>
                        <input
                            onChange={handleOnChangeArtworkTokenIdInput}
                            required
                            placeholder={`${artworkTokenId}`}
                            type="number"
                            min={1}
                        />


                        <label>Price: </label>
                        <input
                            onChange={handleOnChangePriceInput}
                            required
                            placeholder={`${price}`}
                            type="number"
                            min={1}
                        />

                        <label>Currencies: </label>
                        <select
                            id="formGridState"
                            value={currencyToken}
                            onChange={handleChangeCurrency}
                        >
                            {
                                Object.keys(currencies).map(k => <option key={k} value={k}>{ `${k} (${(currencies as any)[k]})`}</option>)
                            }
                        </select>
                    </div>
                    <div className="_action-panel">
                        <button className="_btn" onClick={() => handleBuyToken(setError, setResult, data)}>Submit</button>
                    </div>
                </div>
                { result && (<>
                    <div>
                        <h5>Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {
                    // error && (<>
                    //     <div className="_error-panel">
                    //         <h5>Error</h5>
                    //         { JSON.stringify(error) }
                    //         <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                    //     </div>
                    // </>)
                }
            </div>
        </Accordion>
    )
}

/* 

 */
export const handleBuyToken = async (setError: any, setResult: any, data?: any, handlers?: any) => {
    const { account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken } = data
    const { artWork: ARTWORK, bid: BID } = contracts

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        // if (!ARTWORK) { throw { message: "Artwork contract not available" } }
        if (!BID) { throw { message: "Bid contract not available" } }
        if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }
        // if (!price) { throw { message: "Invalid price" } }
        // if (!currencyToken) { throw { message: "Invalid currency token" } }

        let resultTxApprove;
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) {
        //     resultTxApprove = await ARTWORK.approve(
        //         BID.address, artworkTokenId
        //     )
        // }

        const resultTx = await BID.buyToken(
            artworkTokenId,
            {
                value: "0x0"
            }
        )

        setError(null)
        setResult({ resultTxApprove, resultTx })
    } catch (error) {
        setResult(null)
        setError(error)
    }
}

/*  

 */
const FlowBid = () => {
    const { account = "0x0" } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const { artWork: ARTWORK } = contracts

    // const { currencies } = contracts
    const currencies = {
        "WBNB": "0xae13d989dac2f0debff460ac112a837c89baa7cd",
        "JFIN": "0x1df0672a4553090573ffc1260f4e9fca8575d366",
    }

    const [ artworkTokenId, setArtworkTokenId ] = useState(1)
    const [ artworkTokenOwner, setArtworkTokenOwner ] = useState("")
    const [ price, setPrice ] = useState(0)
    const [ currencyToken, setCurrencyToken ] = useState("WBNB")

    const _account = account ? (account as string).toLowerCase() : ""
    const resolvedCurrencyAddress = currencies && (currencies as any)[currencyToken]

    const data = { account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken: resolvedCurrencyAddress }

    const handleOnChangeArtworkTokenIdInput = ({ target }: any) => {
        if (target.value > 0) {
            setArtworkTokenId(target.value)
            getArtworkOwner(artworkTokenId).then()
        }
    }

    const handleOnChangePriceInput = ({ target }: any) => {
        if (target.value > 0) { setPrice(target.value) }
    }

    const handleChangeCurrency = (event: ChangeEvent<HTMLSelectElement>) => {
        setCurrencyToken(event.target.value)
    }

    const getArtworkOwner = async (artworkTokenId: number) => {
        try {
            if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
            const _result = await ARTWORK.ownerOf(artworkTokenId)
            setArtworkTokenOwner(_result)
            setResult(_result)
            setError(null)
            return _result
        } catch (error) {
            setResult(null)
            setError(error)
        }
    }

    useEffect(() => {
        (async () => {
            await getArtworkOwner(artworkTokenId)
        })()
    }, [ artworkTokenId ] )

    return (
        <Accordion title="[FLOW] Bid Work (Only Buyer)">
            <div className="debug-panel">
                <div>
                    <h5>Bid Token bidToken(uint256 _tokenId, uint256 _price)</h5>
                    <div className="_requirement-panel">
                        Require:
                            - Must not be seller
                    </div>
                    <div>
                        <div>Artwork Owner: {artworkTokenOwner}
                            <span className="text-danger">{(artworkTokenOwner).toLowerCase() === _account && " This account is an owner" }</span>
                        </div>

                        {/* <div>Selected Currency Token: {currencyToken} ({(currencies as any)[currencyToken]})</div> */}

                        <label>Artwork Token Id: </label>
                        <input
                            onChange={handleOnChangeArtworkTokenIdInput}
                            required
                            placeholder={`${artworkTokenId}`}
                            type="number"
                            min={1}
                        />


                        <label>Price: </label>
                        <input
                            onChange={handleOnChangePriceInput}
                            required
                            placeholder={`${price}`}
                            type="number"
                            min={1}
                        />

                        <label>Currencies: </label>
                        <select
                            id="formGridState"
                            value={currencyToken}
                            onChange={handleChangeCurrency}
                        >
                            {
                                Object.keys(currencies).map(k => <option key={k} value={k}>{ `${k} (${(currencies as any)[k]})`}</option>)
                            }
                        </select>
                    </div>
                    <div className="_action-panel">
                        <button className="_btn" onClick={() => handleBidToken(setError, setResult, data)}>Submit</button>
                    </div>
                </div>
                { result && (<>
                    <div>
                        <h5>Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {
                    // error && (<>
                    //     <div className="_error-panel">
                    //         <h5>Error</h5>
                    //         { JSON.stringify(error) }
                    //         <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                    //     </div>
                    // </>)
                }
            </div>
        </Accordion>
    )
}

/* 

 */
export const handleBidToken = async (setError: any, setResult: any, data?: any, handlers?: any) => {
    const { account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken } = data
    const { artWork: ARTWORK, bid: BID } = contracts

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        // if (!ARTWORK) { throw { message: "Artwork contract not available" } }
        if (!BID) { throw { message: "Bid contract not available" } }
        if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }
        // if (!price) { throw { message: "Invalid price" } }
        // if (!currencyToken) { throw { message: "Invalid currency token" } }

        let resultTxApprove;
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) {
        //     resultTxApprove = await ARTWORK.approve(
        //         BID.address, artworkTokenId
        //     )
        // }

        const resultTx = await BID.bidToken(
            artworkTokenId,
            price
        )

        setError(null)
        setResult({ resultTxApprove, resultTx })
    } catch (error) {
        setResult(null)
        setError(error)
    }
}

/*  

 */
const FlowUpdateBidPrice = () => {
    const { account = "0x0" } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const { artWork: ARTWORK } = contracts

    // const { currencies } = contracts
    const currencies = {
        "WBNB": "0xae13d989dac2f0debff460ac112a837c89baa7cd",
        "JFIN": "0x1df0672a4553090573ffc1260f4e9fca8575d366",
    }

    const [ artworkTokenId, setArtworkTokenId ] = useState(1)
    const [ artworkTokenOwner, setArtworkTokenOwner ] = useState("")
    const [ price, setPrice ] = useState(0)
    const [ currencyToken, setCurrencyToken ] = useState("WBNB")

    const _account = account ? (account as string).toLowerCase() : ""
    const resolvedCurrencyAddress = currencies && (currencies as any)[currencyToken]

    const data = { account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken: resolvedCurrencyAddress }

    const handleOnChangeArtworkTokenIdInput = ({ target }: any) => {
        if (target.value > 0) {
            setArtworkTokenId(target.value)
            getArtworkOwner(artworkTokenId).then()
        }
    }

    const handleOnChangePriceInput = ({ target }: any) => {
        if (target.value > 0) { setPrice(target.value) }
    }

    const handleChangeCurrency = (event: ChangeEvent<HTMLSelectElement>) => {
        setCurrencyToken(event.target.value)
    }

    const getArtworkOwner = async (artworkTokenId: number) => {
        try {
            if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
            const _result = await ARTWORK.ownerOf(artworkTokenId)
            setArtworkTokenOwner(_result)
            setResult(_result)
            setError(null)
            return _result
        } catch (error) {
            setResult(null)
            setError(error)
        }
    }

    useEffect(() => {
        (async () => {
            await getArtworkOwner(artworkTokenId)
        })()
    }, [ artworkTokenId ] )

    return (
        <Accordion title="[FLOW] Update Bid Price (Only Buyer)">
            <div className="debug-panel">
                <div>
                    <h5>Bid Token updateBidPrice(uint256 _tokenId, uint256 _price)</h5>
                    <div className="_requirement-panel">
                        Require:
                            - Must not be seller
                    </div>
                    <div>
                        <div>Artwork Owner: {artworkTokenOwner}
                            <span className="text-danger">{(artworkTokenOwner).toLowerCase() === _account && " This account is an owner" }</span>
                        </div>

                        {/* <div>Selected Currency Token: {currencyToken} ({(currencies as any)[currencyToken]})</div> */}

                        <label>Artwork Token Id: </label>
                        <input
                            onChange={handleOnChangeArtworkTokenIdInput}
                            required
                            placeholder={`${artworkTokenId}`}
                            type="number"
                            min={1}
                        />


                        <label>Price: </label>
                        <input
                            onChange={handleOnChangePriceInput}
                            required
                            placeholder={`${price}`}
                            type="number"
                            min={1}
                        />

                        <label>Currencies: </label>
                        <select
                            id="formGridState"
                            value={currencyToken}
                            onChange={handleChangeCurrency}
                        >
                            {
                                Object.keys(currencies).map(k => <option key={k} value={k}>{ `${k} (${(currencies as any)[k]})`}</option>)
                            }
                        </select>
                    </div>
                    <div className="_action-panel">
                        <button className="_btn" onClick={() => handleUpdateBidPrice(setError, setResult, data)}>Submit</button>
                    </div>
                </div>
                { result && (<>
                    <div>
                        <h5>Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {
                    // error && (<>
                    //     <div className="_error-panel">
                    //         <h5>Error</h5>
                    //         { JSON.stringify(error) }
                    //         <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                    //     </div>
                    // </>)
                }
            </div>
        </Accordion>
    )
}

/* 

 */
export const handleUpdateBidPrice = async (setError: any, setResult: any, data?: any, handlers?: any) => {
    const { account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken } = data
    const { artWork: ARTWORK, bid: BID } = contracts

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        // if (!ARTWORK) { throw { message: "Artwork contract not available" } }
        if (!BID) { throw { message: "Bid contract not available" } }
        if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }
        // if (!price) { throw { message: "Invalid price" } }
        // if (!currencyToken) { throw { message: "Invalid currency token" } }

        let resultTxApprove;
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) {
        //     resultTxApprove = await ARTWORK.approve(
        //         BID.address, artworkTokenId
        //     )
        // }

        const resultTx = await BID.updateBidPrice(
            artworkTokenId,
            price,
        )

        setError(null)
        setResult({ resultTxApprove, resultTx })
    } catch (error) {
        setResult(null)
        setError(error)
    }
}

/*  

 */
const FlowApproveCurrencyToken = () => {
    const { account = "0x0" } = useDAppContext()
    const { contracts } = useEthersContext()
    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)
    const { artWork: ARTWORK } = contracts

    // const { currencies } = contracts
    const currencies = {
        "WBNB": "0xae13d989dac2f0debff460ac112a837c89baa7cd",
        "JFIN": "0x1df0672a4553090573ffc1260f4e9fca8575d366",
    }

    // const [ artworkTokenId, setArtworkTokenId ] = useState(1)
    // const [ artworkTokenOwner, setArtworkTokenOwner ] = useState("")
    // const [ price, setPrice ] = useState(0)
    const [ currencyToken, setCurrencyToken ] = useState("WBNB")

    const _account = account ? (account as string).toLowerCase() : ""
    // const resolvedCurrencyAddress = currencies && (currencies as any)[currencyToken]

    const data = { account, contracts, /* price,  */currencyToken }

    // const handleOnChangeArtworkTokenIdInput = ({ target }: any) => {
    //     if (target.value > 0) {
    //         setArtworkTokenId(target.value)
    //         getArtworkOwner(artworkTokenId).then()
    //     }
    // }

    // const handleOnChangePriceInput = ({ target }: any) => {
    //     if (target.value > 0) { setPrice(target.value) }
    // }

    const handleChangeCurrency = (event: ChangeEvent<HTMLSelectElement>) => {
        setCurrencyToken(event.target.value)
    }

    // const getArtworkOwner = async (artworkTokenId: number) => {
    //     try {
    //         if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
    //         const _result = await ARTWORK.ownerOf(artworkTokenId)
    //         setArtworkTokenOwner(_result)
    //         setResult(_result)
    //         setError(null)
    //         return _result
    //     } catch (error) {
    //         setResult(null)
    //         setError(error)
    //     }
    // }

    // useEffect(() => {
    //     (async () => {
    //         await getArtworkOwner(artworkTokenId)
    //     })()
    // }, [ artworkTokenId ] )

    return (
        <Accordion title="[FLOW] Approve Currency Token (Only Buyer, ERC20)">
            <div className="debug-panel">
                <div>
                    <h5>Approve Currency Token</h5>
                    <div className="_requirement-panel">
                        Require:
                            - Must not be seller
                    </div>
                    <div>
                        {/* <div>Artwork Owner: {artworkTokenOwner}
                            <span className="text-danger">{(artworkTokenOwner).toLowerCase() === _account && " This account is an owner" }</span>
                        </div> */}

                        {/* <div>Selected Currency Token: {currencyToken} ({(currencies as any)[currencyToken]})</div> */}

                        {/* <label>Artwork Token Id: </label>
                        <input
                            onChange={handleOnChangeArtworkTokenIdInput}
                            required
                            placeholder={`${artworkTokenId}`}
                            type="number"
                            min={1}
                        /> */}

{/* 
                        <label>Price: </label>
                        <input
                            onChange={handleOnChangePriceInput}
                            required
                            placeholder={`${price}`}
                            type="number"
                            min={1}
                        /> */}

                        <label>Currencies: </label>
                        <select
                            id="formGridState"
                            value={currencyToken}
                            onChange={handleChangeCurrency}
                        >
                            {
                                Object.keys(currencies).map(k => <option key={k} value={k}>{ `${k} (${(currencies as any)[k]})`}</option>)
                            }
                        </select>
                    </div>
                    <div className="_action-panel">
                        <button className="_btn" onClick={() => handleApproveCurrencyToken(setError, setResult, data)}>Submit</button>
                    </div>
                </div>
                { result && (<>
                    <div>
                        <h5>Result</h5>
                        { JSON.stringify(result, null, 2) }
                    </div>
                    <button className="_btn" onClick={() => { setResult(null) }}>Clear</button>
                </>)
                }
                <PanelError error={error} setError={setError} />
                {
                    // error && (<>
                    //     <div className="_error-panel">
                    //         <h5>Error</h5>
                    //         { JSON.stringify(error) }
                    //         <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                    //     </div>
                    // </>)
                }
            </div>
        </Accordion>
    )
}

/* 

 */
export const handleApproveCurrencyToken = async (setError: any, setResult: any, data?: any, handlers?: any) => {
    const { account, contracts, currencyToken, price } = data
    const { artWork: ARTWORK, bid: BID } = contracts
    const tokenSmartContract = contracts[currencyToken]

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        // if (!ARTWORK) { throw { message: "Artwork contract not available" } }
        // if (!BID) { throw { message: "Bid contract not available" } }
        // if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }
        // if (!price) { throw { message: "Invalid price" } }
        // if (!currencyToken) { throw { message: "Invalid currency token" } }
        // const _price = price || /* `${(9999999 * (10 ** 18))}` */
        // const _price = 9 * (10 ** 18)
        const _price = BigNumber.from("0xfffffffffffff")
        let resultTxApprove;
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) {
        //     resultTxApprove = await ARTWORK.approve(
        //         BID.address, artworkTokenId
        //     )
        // }

        const resultTx = await tokenSmartContract.approve(
            BID.address,
            _price,
        )

        setError(null)
        setResult({ resultTxApprove, resultTx })
    } catch (error) {
        setResult(null)
        setError(error)
    }
}

const FlowSetAuction = () => {
    return (
        <Accordion title="[FLOW] Set Auction">
            <div className="debug-panel">
            </div>
        </Accordion>
    )
}

const ContractProp = (props: any) => {
    const { k: key, contract } = props
    const type = key.includes("()") ? "function" : "property"

    return (
        <div>
            {
                type === "function" ? (
                    <div>{key}</div>
                ) : (
                    <div>{key}</div>
                )
            }
        </div>
    )
}

const Accordion = (props: any) => {
    const [ expanded, setExpanded ] = useState(false)

    return (
        <article className='accordion-container'>
            <header onClick={() => setExpanded(!expanded)} className='_title'>
                <h4 className='_title'>
                    { props.title || "No title" }
                </h4>
                <button className='_toggle-button' onClick={() => setExpanded(!expanded)}>
                    {expanded ? "+" : "-" }
                </button>
            </header>
            {expanded && <div className="_content">{ props.children }</div>}
        </article>
    )
}

const PanelError = (props: any) => {
    const { error, setError } = props
    return (
        error
        ? (<>
                <div className="_error-panel">
                    <h5>Error</h5>
                    { JSON.stringify(error) }
                    <button className="_btn" onClick={() => { setError(null) }}>Clear</button>
                </div>
            </>
        ) : (
            <></>
        )
    )
}
