import { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react'
import { Link, useHistory } from 'react-router-dom'
import * as ethers from 'ethers'
import { BigNumber } from 'ethers'

import { useDAppContext } from 'providers/dapp'
import { useEthersContext } from 'providers/ethers'
import { LoadingScreen } from 'components/Loader'
import { ConnectButton } from 'components/Wallet'
import { AddressMask } from 'components/AddressMask';

import { bidPrice } from 'modules/bid'
import { RiAuctionFill } from 'react-icons/ri'
import { FaHandPointUp, FaHandPaper, FaCheck } from 'react-icons/fa'
import { ImCross } from 'react-icons/im'
import { $firebase, firestore } from 'libs/firebase-sdk'

import { TextField } from 'components/index'
import { DividerProps } from '@material-ui/core'

import { safeAddress } from 'utils/contract'
import Debug, { $debug } from 'utils/debug'

import { FallbackWorkIsNotApproved } from "components/Fallbacks"
import { DateTimePicker } from 'react-rainbow-components';
import { useInterval } from 'hooks/utils'
import { $processor } from 'helpers/container'
import { CountdownTimerDisplay } from 'components/Timer'

type Props = {
    data?: any
    workID?: string
}

enum Panel {
    Main = "main",
    Buy = "buy",
    Bid = "bid",
    AuctionSetup = "auction-setup",
    AuctionView = "auction-view",
    PriceOfferingSetup = "price-offering-setup",
    PriceOfferingView = "price-offering-view",
}

enum UserRole {
    Anonymous = "anonymous",
    Seller = "seller",
    Buyer = "buyer",
}


export enum SellingType {
    PENDING = "PENDING",
    OFFERING = "OFFERING",
    AUCTION = "AUCTION"
}

const currencies = {
    "0xf59b76a537af7094d6ccf8810da352db4691d2e5": {
        symbol: "fJFIN",
        decimals: 18,
        address: "0xF59b76a537AF7094D6CCF8810dA352dB4691D2e5",
        type: "BEP20",
        chainId: 97,
        network: "bsc-testnet"
    }
}

const defaultCurrency = {
    symbol: "fJFIN",
    address: "0xf59b76a537af7094d6ccf8810da352db4691d2e5"
}

export default function ItemDetail({ data: parentData }: Props) {
    const [ processing, setProcessing ] = useState({ isProcessing: false, isLoading: true })

    const { account, chain } = useDAppContext()
    const { contracts } = useEthersContext()
    
    const { id: uuid, tokenID: artworkTokenId, isReadyToSell: _isReadyToSell } = parentData
    
    // const [ isLoading, setIsLoading ] = useState(true)

    const [ result, setResult ] = useState<any>(null)
    const [ error, setError ] = useState<any>(null)

    // const [ currency, setCurrency ] = useState("BNB")
    const [ panel, setPanel ] = useState<Panel>(Panel.Main)
    const [ approvedCurrencyTokens, setApprovedCurrencyTokens] = useState({})
    const [ isApprovedForAll, setIsApprovedForAll ] = useState(false)
    const [ isSellingPopupActive, setSellingPopupActive ] = useState(false)
    const [ isAuctionStarted, setIsAuctionStarted ] = useState(false)
    const [ artworkTokenOwner, setArtworkTokenOwner ] = useState("")
    const [ artworkTokenMinter, setArtworkTokenMinter ] = useState("")
    const [ artworkTokenSeller, setArtworkTokenSeller ] = useState("")
    const [ isReadyToSell, setReadyToSell ] = useState(false)
    const [ sellingType, setSellingType ] = useState(0)
    
    const [ isUpdate, setIsUpdate] = useState(false);
    const forceUpdate = useCallback(() => setIsUpdate(true),[])

    const [ price, setPrice ] = useState("0")
    const [ currentPrice, setCurrentPrice ] = useState("0")
    const [ currencyToken, setCurrencyToken ] = useState(defaultCurrency)
    const [ isBidding, setIsBidding ] = useState(false)
    const [ sellEndTime, setSellEndTime ] = useState<number>(0)
    const [ creatorInfo, setCreatorInfo ] = useState<any>(null)

    const [ userRole, setUserRole ] = useState<UserRole>(UserRole.Anonymous)
    
    // console.log("Check is processing on root", processing)
    // const resolvedCurrencyAddress = currencies && (currencies as any)[currencyToken.symbol]
    console.log("sellEndTime", sellEndTime)

    const $d = { 
        ...parentData,
        uuid,
        chain,
        account,
        contracts,
        error,
        result,
        processing,
        price,
        currentPrice,
        currencyToken,
        currencies,
        artworkTokenMinter,
        artworkTokenOwner,
        artworkTokenSeller,
        sellingType,
        sellEndTime,
        userRole
    }

    const $h = {
        setError, setResult, setPanel, setPrice, forceUpdate, setProcessing,
        handleChangeCurrency,
        handleOnChangePriceInput,
        toggleSetSellingPricePopup,
        handleApprovalForAllResult,
        handleSetBidding,
        handleSetOfferingPanel,
    }

    const { $result, $error, $finalizer } = $processor({ data: $d, handlers: $h })

    // This function is for checking that user is approve all ERC-721 tokens.
    const checkApprovalForAll = async () => {
        // console.log("checkApprovalForAll", account, contracts.NFTMARKET)
        if (account && contracts.NFTMARKET.address) {
            const _result = await contracts.NFTWORK.isApprovedForAll(account, contracts.NFTMARKET.address)
            setIsApprovedForAll(_result)
        }
    }

    // const checkOwnerOfNFT = async (_artworkTokenId: string) => {
    //     try {
    //         const _result = await contracts.NFTWORK.minterOf(_artworkTokenId)
    //         if (safeAddress(_result) === safeAddress(account)) {
    //             return true
    //         }
    //         setArtworkTokenOwner(_result)

    //         return false
    //     } catch (error) {
    //         console.error(error)
    //         return false
    //     }
    // }

    const checkSellerOfNFT = async (_artworkTokenId: string) => {
        try {
            const _result = await contracts.NFTMARKET._tokenSellers(_artworkTokenId)
            setArtworkTokenSeller(_result)

            if (safeAddress(_result) === safeAddress(account)) {
                return true
            }

            return false
        } catch (error) {
            // console.error(error)
            return false
        }
    }

    const checkCurrentPrice = async (_artworkTokenId: string) => {
        try {
            if (!contracts.NFTMARKET) { throw { message: "NFTMARKET contract not existed" } }

            const _result = await contracts.NFTMARKET.getCurrentPrice(_artworkTokenId)
            // console.log(_result)
            if (_result) {
                const _price = _result.toString()
                setCurrentPrice(_price)
            }
            // console.log("checkCurrentPrice", _result)
        } catch (error) {
            //console.error(error)
        }
    }

    const checkAllowanceForCurrencyToken = async (_currencyToken: any) => {
        // console.log("Approved Currency", approvedCurrencyTokens)
        // @ts-ignore
        const debug = new Debug("checkAllowanceForCurrencyToken")
        // // console.log(debug)
        debug.info("account", account)
        debug.object("contracts.NFTMARKET", contracts.NFTMARKET)
    
        try {
            const currencyTokenContract = contracts[chain.code][safeAddress(_currencyToken.address)]

            if (!account) throw { internal: true, data: { message: "Account is not available" }}
            if (!_currencyToken.address) throw { internal: true, data: { message: "Invalid currency token address" }}
            if (!currencyTokenContract) throw { internal: true, data: { message: "Currency token contract not found" }}
            if (!currencyTokenContract.allowance) throw { internal: true, data: { message: "Currency token contract not support allowance checking" }}
            if (!contracts.NFTMARKET) throw { internal: true, data: { message: "Invalid NFT bidding contract" }}
            
            const _result = await currencyTokenContract.allowance(account, contracts.NFTMARKET.address)
            $debug.info(`Allowance amount of ${_currencyToken.symbol} (${_currencyToken.address}) to NFT Market Contract (${contracts.NFTMARKET.address}):`, _result.toString())
            
            const _approvedAmount = _result.toString()
            const _approvedCurrencyTokens = approvedCurrencyTokens;
            (_approvedCurrencyTokens as any)[safeAddress(_currencyToken.address)] = parseInt(_approvedAmount)
            setApprovedCurrencyTokens(_approvedCurrencyTokens)
            $debug.info("checkAllowanceForCurrencyToken", approvedCurrencyTokens)
        } catch (error) {
            // console.log(error)
            if (error.internal) {
                // console.error("checkAllowanceForCurrencyToken Error:", error.data.message)
            }
        }
    }

    const checkReadyToSell = async () => {
        console.log("checkReadyToSell", contracts.NFTWORK, artworkTokenId)
        try {
            // if (!contracts.NFTMARKET) {
            //     throw {}
            // } else {
            //     // const _result = checkOwnerOfNFT(artworkTokenId)
            //     // console.log("checkReadyToSell")
            //     // setReadyToSell(_result)
            //     const _askedByUser = await contracts.NFTMARKET.getAsksByUser(account)
            //     // console.log("getAsksByUser", _askedByUser)
            //     // if (_askedByUser[0] && _askedByUser[0].price.toString() !== "0") {
            //     //     setReadyToSell(true)
            //     // } else {
            //     //     setReadyToSell(false)
            //     // }
            //     const _askedLength = await contracts.NFTMARKET.getAsksLength()
            //     // console.log("getAsksLength", _askedLength)
            // }
            if (contracts.NFTWORK && artworkTokenId) {
                contracts.NFTWORK.ownerOf(artworkTokenId)
                    .then((result: string) => {
                        setArtworkTokenOwner(result)
                        if (safeAddress(result) === safeAddress(contracts.NFTMARKET.address)) {
                            setReadyToSell(true)
                        } else { 
                            setReadyToSell(false)
                        }
                    })
                    .catch((error: any) => console.error("Error on get Owner Of", error));

                contracts.NFTWORK.minterOf(artworkTokenId)
                    .then((result: string) => setArtworkTokenMinter(result))
                    .catch((error: any) => console.error("Error on get Minter Of", error));

            } else {
                console.log("Contract NFTWORK is not available")
            }

            
        } catch (e) {

        }
    }

    const checkUserRole = () => {
        if (account) {
            if (sellingType !== 0) {
                if (safeAddress(artworkTokenSeller) === safeAddress(account)) { return UserRole.Seller }
                else { return UserRole.Buyer }
            } else {
                if (safeAddress(artworkTokenOwner) === safeAddress(account)) { return UserRole.Seller }
                else { return UserRole.Buyer }
            }
        }

        return UserRole.Anonymous
    }

    function toggleSetSellingPricePopup (flag = false) {
        setSellingPopupActive(flag)
    }

    // Processing Monitoring
    useEffect(() => {
        // if (processing.isLoading && !processing.isProcessing) {
            // TODO: Change to be interval base with clear interval
            setTimeout(() => {
                const processing_ = { ...processing, isLoading: false }
                setProcessing(processing_)
            }, 2000)
        // }
    }, [])

    useEffect(() => {
        handleChangeCurrency(null, defaultCurrency.address)
        // setIsLoading(false)
    }, [processing])


    //
    // useEffect(() => {
    //     console.log("Check User Role", safeAddress(account))
    //     setUserRole(checkUserRole())
    // }, [account, artworkTokenOwner, artworkTokenSeller])



    // Check Contract Approval
    useEffect(() => {
        console.log(
            "useEffect check by [ account, contracts.NFTWORK, contracts.NFTMARKET, artworkTokenOwner, isLoading ]", 
            { account, contractNFTWORK: contracts.NFTWORK, contractNFTMARKET: contracts.NFTMARKET, artworkTokenOwner, isLoading: processing.isLoading }
        );

        (async () => {

            getCreator(parentData.creator).then(setCreator)

            if (contracts.NFTMARKET && 
                (
                    safeAddress(account) === safeAddress(artworkTokenOwner)
                    || (
                        safeAddress(artworkTokenOwner) === safeAddress(contracts.NFTMARKET.address)
                        && safeAddress(artworkTokenMinter) === safeAddress(account)
                    )
                )     
            ) {
                checkApprovalForAll().then().catch()
            }
            checkAllowanceForCurrencyToken(currencyToken).then().catch()
            checkReadyToSell().then().catch()

            if (sellingType !== 0) {
                checkCurrentPrice(artworkTokenId).then().catch()
            }

        })()

        if (contracts.NFTWORK && contracts.NFTMARKET && artworkTokenOwner && !processing.isLoading) {
            processing.isLoading = false
            setProcessing(processing)
        }
        setUserRole(checkUserRole())

    }, [ account, contracts.NFTWORK, contracts.NFTMARKET, artworkTokenOwner, artworkTokenSeller, processing.isLoading ])


    const getArtworkHolders = async (artworkTokenId: number) => {
        
        try {
            if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
            if (!contracts.NFTWORK) { throw { message: "Invalid NFT Work contract" } }
            if (!contracts.NFTMARKET) { throw { message: "Invalid NFT Market contract" } }
            
            contracts.NFTWORK.ownerOf(artworkTokenId)
            .then((_address: any) =>  {
                // console.log("OWNER", _address)
                setArtworkTokenOwner(_address)
            })
            .catch((error: any) => {
                // console.log("ERROR GET MINTER", error)
            })
    
            contracts.NFTWORK.minterOf(artworkTokenId)
            .then((_address: any) =>  {
                // console.log("MINTER", _address)
                setArtworkTokenMinter(_address)
            })
            .catch((error: any) => {
                // console.log("ERROR GET MINTER", error)
            })
            
            contracts.NFTMARKET.getCurrentSeller(artworkTokenId)
            .then((_address: any) =>  {
                // console.log("SELLER", _address)
                setArtworkTokenSeller(_address)
                // if (_address !== "0x0000000000000000000000000000000000000000") {
                // } else {
                //     // setReadyToSell(false)
                // }
            })
            .catch((error: any) => {
                console.log("ERROR GET SELLER", error)
            })

        } catch (error) {
            console.log("getArtworkHolders", error)
            setResult(null)
            setError(error)
        }
    }



    useEffect(() => {
        // console.log("useEffect - getArtworkTokenOwner")
        console.log("useEffect - getArtworkHolders")
        getArtworkHolders(artworkTokenId)

        console.log("useEffect - getSellingType")
        getSellingType(artworkTokenId)
            .then((result): any => {
                setSellingType(result)
                console.log("useEffect - getEndTime after getSellingType", result)
                
                
                if (result !== 0) {
                    checkCurrentPrice(artworkTokenId).then().catch()
                    
                    if (result === 2) {
                        getEndTime(artworkTokenId)
                            .then((_result => {
                                console.log("endTime", result)
                                if (_result) {
                                    setSellEndTime(_result)
                                }
                            }))
                            .catch((error: any) => {
                                console.error("useEffect getSellingType", error)
                            })
                    }
                }
            })
            .catch((error: any) => {
                console.error("useEffect getSellingType", error)
            })
        // console.log("useEffect - getArtworkTokenOwner")
    }, [ artworkTokenId, contracts.NFTWORK, contracts.NFTMARKET, processing ] )

    interface $iCreator {

    }

    async function getCreator (id: string): Promise<any | $iCreator> {
        const _result = await firestore.collection('users').doc(id).get()
        if (_result.exists) {
            return _result.data()
        }
        return null
    }

    async function setCreator (data: any) {
        const data_ = {
            name: data.name,
            thumbnail: data?.images?.thumbnail_128 || "placholder",
            address: data.publicAddress
        }
        console.log("setCreatorInfo", data, data_)
        setCreatorInfo(data_)
    }

    const getSellingType = async (_artworkTokenId: number) => {
        try {
            if (contracts.NFTMARKET) {
                const _result = await contracts.NFTMARKET._sellingType(_artworkTokenId)
                console.log("Selling Type", _result)
                return _result
            }
            return -1
        } catch (error) {
            console.log("getSellingState", error)
        }
    }

    const getEndTime = async (_artworkTokenId: number) => {
        try {
            const _result = await contracts.NFTMARKET.getEndTime(_artworkTokenId)
            console.log("getEndTime", _result.toNumber())
            return _result.toNumber()
        } catch (error) {
            console.error("getEndTime", error)
        }
    }


    async function handleChangeCurrency (event: ChangeEvent<HTMLSelectElement> | null, _currencyTokenAddress: any) {
        // // console.log("handleChangeCurrency", event || _currencyTokenAddress )
        setCurrencyToken((currencies as any)[event ? event.target.value : _currencyTokenAddress])
    }

    async function handleOnChangePriceInput({ target }: any) {
        if (target.value > 0) {
            const _price: string = (target.value * 10 ** 18).toString()
            setPrice(_price)
        } else {
            warning("Price must be greater than zero");
        }
    }

    async function handleApprovalForAllResult(txResult: any) {
        if (txResult) {
            processing.isLoading = false
            setProcessing(processing)
        }
    }

    async function handleSetBidding(active: boolean) {
        if (active) {
            setPanel(Panel.Bid)
        } else {
            setPanel(Panel.Main)
        }
        setIsBidding(active)
    }

    async function handleSetOfferingPanel(active: boolean) {
        if (active) {
            setPanel(Panel.PriceOfferingView)
        } else {
            setPanel(Panel.Main)
        }
        // setIsBidding(active)
    }

    async function handleCancelPriceOfferingSell() {
        try {
            setProcessing({ ...processing, isProcessing: true, isLoading: true })
            const tx = await contracts.NFTMARKET.cancelPriceOfferingSell(artworkTokenId)
            
            tx.wait()
            .then((txResult: any) => {
                setResult({ tx, txResult })
                setArtworkSellingData(uuid, SellingType.PENDING, null)
                setCurrentPrice("0")
            })
            .catch($error)
            .finally($finalizer)
        } catch (error) {
            $finalizer()
            // console.error(error)
        }
    }

    async function handleCancelAuctionSell() {
        try {
            setProcessing({ ...processing, isProcessing: true, isLoading: true })
            const tx = await contracts.NFTMARKET.cancelAuctionSell(artworkTokenId)
            
            tx.wait()
            .then((txResult: any) => {
                setResult({ tx, txResult })
                setCurrentPrice("0")
                setSellEndTime(0)
            })
            .catch($error)
            .finally($finalizer)
        } catch (error) {
            // console.error(error)
            if (error.code === -32603) {
                if (error.data.message === "execution reverted: already have bidder") {
                    alert("You cannot cancel auction that already have a bidder")
                    setProcessing({ ...processing, isLoading: false })
                }
            }
        }
    }

    async function handleEndAuctionSell() {
        try {
            
            processing.isLoading = true
            processing.isProcessing = true
            setProcessing(processing)
            const tx = await contracts.NFTMARKET.sellAuctionToken(artworkTokenId)
            
            tx.wait()
            .then((txResult: any) => {
                setResult({ tx, txResult })
                setCurrentPrice("0")
            })
            .catch()
        } catch (error) {
            // console.error(error)
        }
    }

    return (<>
        <LoadingScreen isLoading={processing.isLoading} />
        {/* <div className="debugs">
            <span>{ "Token " + artworkTokenId }</span>
            <span>{ "Minter " + artworkTokenMinter }</span>
            <span>{ "Ownner " + artworkTokenOwner }</span>
            <span>{ "Seller " + artworkTokenSeller }</span>
            <span>isLoading { processing.isLoading ? "True" : "False" }</span>
            <span>User Role { userRole }</span>
        </div> */}

        {
            isSellingPopupActive && <SetSellingPricePopup data={$d} handlers={$h} />
        }

        {
            panel === Panel.Main
            ? (<>
                <div id="container-detail" className="item-container">
                    <div className="item-wrapper">
                        <div className="item-wrapper-content">
                            <div id="gallery-detail" className="gallery-container" >
                                <div className="gallery-wrapper">
                                    <figure className="gallery-wrapper-content">
                                        <img src={$d?.resource.origin} alt="" />
                                    </figure>
                                </div>
                            </div>

                            <div className="item-content">
                                <div className="__group-top">
                                    <div className="nft-title">
                                        <h1 className="_title">
                                            {$d?.name}
                                        </h1>
                                        { sellingType && sellingType === 1 && (<span className="sell-badge">Price Offer</span>) }
                                        { sellingType && sellingType === 2 && (<span className="sell-badge">Auction</span>) }
                                    </div>
                                    <CurrentPriceDisplay data={$d} />

                                    {/* {
                                        sellingType !== 0
                                        ? (<h5 className="text-black">Ready to sell</h5>)
                                        : (<h5 className="text-black">Not on sell</h5>)
                                    } */}
                                    {
                                        account ? (<>
                                            { // Connected user
                                            }
                                            {
                                                sellingType !== 0
                                                ? (<>
                                                    {
                                                        safeAddress(artworkTokenMinter) === safeAddress(account)
                                                        ? (<h5 className="text-black">Minted by you</h5>)
                                                        : (<h5 className="text-black">Minted by: <AddressMask address={artworkTokenMinter} /></h5>)
                                                    }
                                                    {
                                                        safeAddress(artworkTokenOwner) === safeAddress(account)
                                                        ? (<h5 className="text-black">Owned by you</h5>)
                                                        : safeAddress(artworkTokenOwner) !== safeAddress(contracts?.NFTMARKET?.address)
                                                            ? (<>
                                                                <span className="text-black">Owned by: <AddressMask address={artworkTokenOwner} /></span>
                                                                <Link to={`/profile/${safeAddress(artworkTokenOwner)}`}><span className="view-more-small">View more</span></Link>
                                                            </>)
                                                            : (<></>)
                                                    }
                                                    {
                                                        safeAddress(artworkTokenSeller) === safeAddress(account)
                                                        ? (<h5 className="text-black">Sell by you</h5>)
                                                        : (<>
                                                            <span className="text-black">Sell by: <AddressMask address={artworkTokenSeller} /></span>
                                                            <Link to={`/profile/${safeAddress(artworkTokenSeller)}`}><span className="view-more-small">View more</span></Link>
                                                        </>)
                                                    }
                                                </>)
                                                : (<>
                                                    {
                                                        safeAddress(artworkTokenMinter) === safeAddress(account)
                                                        ? (<h5 className="text-black">Minted by you</h5>)
                                                        : (<h5 className="text-black">Minted by: <AddressMask address={artworkTokenMinter} /></h5>)
                                                    }
                                                    {
                                                        safeAddress(artworkTokenOwner) === safeAddress(account)
                                                        ? (<h5 className="text-black">Owned by you</h5>)
                                                        : (<>
                                                            <span className="text-black">Owned by: <AddressMask address={artworkTokenOwner} /></span>
                                                            <Link to={`/profile/${safeAddress(artworkTokenOwner)}`}><span className="view-more-small">View more</span></Link>
                                                        </>)
                                                    }
                                                    {/* {
                                                        artworkTokenSeller !== "0x0000000000000000000000000000000000000000"
                                                        && (
                                                            safeAddress(artworkTokenSeller) === safeAddress(account) 
                                                            ? (<h5 className="text-black">Sell by you</h5>)
                                                            : (<h5 className="text-black">Sell by: <AddressMask address={artworkTokenSeller} /></h5>)
                                                        )
                                                    } */}
                                                </>)
                                            }
                                        </>)
                                        : (<>
                                            { // Not connected user  
                                            }
                                            <h5 className="text-black">Minted by: <AddressMask address={artworkTokenMinter} /></h5>
                                        </>)
                                        // 
                                        // Show
                                        // A. Not connected: Show only Minter

                                        // B. Connected:
                                        //  1. If user is not a seller of this work: Show Minter, Owner and Seller (if available)
                                        //  2. If user is a seller of this work:
                                        //      I: and also a minter: Show that user is owned this work
                                        // (account && (safeAddress(artworkTokenOwner) === safeAddress(account)))
                                        // ? <h5 className="ownership-display">Owned by you</h5>
                                        // : safeAddress(artworkTokenMinter) === safeAddress(artworkTokenOwner)
                                        //     ? <h5 className="text-black">Minted and Owned by: <AddressMask address={artworkTokenOwner} /></h5>
                                        //     : (safeAddress(artworkTokenOwner) === safeAddress(contracts.NFTMARKET.address)
                                        //         ? (<>
                                        //             <h5 className="text-black">Minted by: <AddressMask address={artworkTokenMinter} /></h5>
                                        //             <h5 className="text-black">Owned by: <AddressMask address={artworkTokenSeller} /></h5>
                                        //             <h5 className="text-black">Ready to buy</h5>
                                        //         </>)
                                        //         : (<>
                                        //             <h5 className="text-black">Minted by: <AddressMask address={artworkTokenMinter} /></h5>
                                        //             <h5 className="text-black">Owned by: <AddressMask address={artworkTokenSeller} /></h5>
                                        //         </>)
                                        //     )
                                    }

                                    <CreatorMiniDisplay creator={creatorInfo} />

                                    <div className={`timer ${sellEndTime * 1000 > new Date().getTime() ? "_active" : ""}`}>
                                        <CountdownTimerDisplay epoch={sellEndTime} type="ending" />
                                        {/* <div className="text-black">End in { Math.round(sellEndTime - (new Date().getTime() / 1000)) } ({ sellEndTime })</div> */}
                                    </div> 
                                </div>
                                <div className="__group-bottom">
                                    <div className="__actions-panel">
                                        <div id="button-detail" className="button-group detail">
                                            <div className="button-group-content">
                                            {/* <h5 className="text-black">Approved { (approvedCurrencyTokens as any)[currencyToken.address] }  Current Price { currentPrice }</h5> */}
                                            {/* {"Owner:" + (safeAddress(account) === safeAddress(artworkTokenOwner)) + ", " + safeAddress(account) + ", " + safeAddress(artworkTokenOwner) + ", " + safeAddress(contracts.NFTMARKET.address)} */}
                                            { 
                                                // Check if account is ready
                                                account
                                                    ?
                                                        // Check if selling state of this work is on selling
                                                        sellingType !== 0                                              
                                                        ? 
                                                            // Check if user is the work owner or not
                                                            // Check if this account is owner of this work
                                                            safeAddress(account) === safeAddress(artworkTokenSeller)
                                                                // User is a seller, display selling configurators
                                                                ? 
                                                                    (<>{/* <span>Seller</span> */}
                                                                        {
                                                                            sellingType === 1 && (<>
                                                                                <button
                                                                                    className="btn-default __icon"
                                                                                    onClick={() => setPanel(Panel.PriceOfferingView)}
                                                                                >
                                                                                    <FaHandPointUp />
                                                                                    <span className="ml-2">View Offered Prices</span>
                                                                                </button>

                                                                                <button
                                                                                    className="btn-default __icon"
                                                                                    onClick={() => handleCancelPriceOfferingSell()}
                                                                                >
                                                                                    <FaHandPointUp />
                                                                                    <span className="ml-2">Cancel Selling</span>
                                                                                </button>
                                                                            </>)
                                                                        }
                                                                        {
                                                                            sellingType === 2 && (<>
                                                                                <button
                                                                                    className="btn-default __icon"
                                                                                    onClick={() => setPanel(Panel.AuctionView)}
                                                                                >
                                                                                    <FaHandPointUp />
                                                                                    <span className="ml-2">View Auction</span>
                                                                                </button>


                                                                                <button
                                                                                    className="btn-default __icon"
                                                                                    onClick={() => handleCancelAuctionSell()}
                                                                                >
                                                                                    <FaHandPointUp />
                                                                                    <span className="ml-2">Cancel Auction</span>
                                                                                </button>

                                                                                
                                                                                { sellEndTime < (new Date().getTime() / 1000) && (
                                                                                        <button
                                                                                            className="btn-default __icon"
                                                                                            onClick={() => handleEndAuctionSell()}
                                                                                        >
                                                                                            <FaHandPointUp />
                                                                                            <span className="ml-2">End Auction</span>
                                                                                        </button>
                                                                                    )
}
                                                                            </>)
                                                                        }
                                                                    </>)
                                                                   
                                                                :   // User is not a seller, display buying options\
                                                                    (<>{/* <span>Buyer</span> */}
                                                                    {/* { JSON.stringify(approvedCurrencyTokens) }
                                                                    { (approvedCurrencyTokens as any)[safeAddress(currencyToken.address)] }
                                                                    { currentPrice } */}
                                                                    {
                                                                        (approvedCurrencyTokens as any)[safeAddress(currencyToken.address)] > currentPrice
                                                                            // Check if user was is approve the smart contract (ERC-20 Token for this case)
                                                                            ? (<>
                                                                                {/* <span>Seller</span> */
                                                                                }
                                                                                {
                                                                                    sellingType === 1 && (<>
                                                                                        <BuyNFTTokenButton data={$d} handlers={$h} />
                                                                                        <button
                                                                                            className="btn-default __icon"
                                                                                            onClick={() => handleSetOfferingPanel(true)}
                                                                                        >
                                                                                            <FaHandPointUp />
                                                                                            <span className="ml-2">Offer your price</span>
                                                                                        </button>
                                                                                    </>)
                                                                                }
                                                                                {
                                                                                    sellingType === 2 && (<>
                                                                                        <button
                                                                                            className="btn-default __icon"
                                                                                            onClick={() => setPanel(Panel.AuctionView)}
                                                                                        >
                                                                                            <FaHandPointUp />
                                                                                            <span className="ml-2">View Auction</span>
                                                                                        </button>
                                                                                    </>)
                                                                                }
                                                                            </>)
                                                                            : (<>
                                                                                <ApproveCurrencyButton data={$d} handlers={$h} />
                                                                            </>)
                                                                    }
                                                                    </>)

                                                            
                                                            // This work is not set for ready to sell
                                                            : safeAddress(account) === safeAddress(artworkTokenOwner)
                                                                ? (<><span>Seller</span>
                                                                    {
                                                                        // Check if this account is the owner of this work
                                                                        isApprovedForAll
                                                                                
                                                                            ? (<><span>Seller</span>
                                                                                <div className="seller-actions">
                                                                                    <SellSetupPanel data={$d} handlers={$h} />
                                                                                </div>

                                                                            </>)

                                                                            
                                                                            
                                                                        // Show requires button for user to approve smart contract to prevent further error
                                                                        : <ApproveForAllButton data={$d} handlers={$h} />
                                                                    }
                                                                </>)
                                                                : (<>
                                                                    {
                                                                        // Buyer (On work not sell)
                                                                        // + Follow for when this work wil be on sell
                                                                        // + View other works from this creator
                                                                    }
                                                                    { // User is not the owner of this work, display buy options 
                                                                    (<>
                                                                        <div className="buyer-actions">
                                                                            {/* <h5 className="text-black">+ Follow for when this work wil be on sell</h5>
                                                                            <h5 className="text-black">+ View other works from this creator</h5> */}
                                                                            {
                                                                                (approvedCurrencyTokens as any)[currencyToken.address] === 0
                                                                                    // Check if user was is approve the smart contract (ERC-20 Token for this case)
                                                                                    ? (<>
                                                                                        {// <PriceInputPanel data={$d} handlers={$h} />
                                                                                        }
                                                                                        {//
                                                                                        //   !isBidding && (<>
                                                                                        //      <BuyNFTTokenButton data={$d} handlers={$h} />
                                                                                        //        <button
                                                                                        //            className="btn-default __icon"
                                                                                        //            onClick={() => handleSetBidding(true)}
                                                                                        //        >
                                                                                        //            <FaHandPointUp />
                                                                                        //            <span className="ml-2">Offer your price</span>
                                                                                        //        </button>
                                                                                        //    </>)
                                                                                        //    /* <PlaceBidButton id={workID} /> */
                                                                                        }
                                                                                    </>)
                                                                                    : (<>
                                                                                        {// <ApproveCurrencyButton data={$d} handlers={$h} /> 
                                                                                        }
                                                                                    </>)
                                                                            }
                                                                        </div>
                                                                    </>)
                                                                    }
                                                                </>)

                                                    : (<>
                                                        <ConnectButton />
                                                    </>)
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>)
            : panel === Panel.Bid && (<><BidPanel data={$d} handlers={$h} /></>)
            || panel === Panel.PriceOfferingSetup && (<><PriceOfferingSetupPanel data={$d} handlers={$h} /></>)
            || panel === Panel.AuctionSetup && (<><AuctionSetupPanel data={$d} handlers={$h} /></>)
            || panel === Panel.PriceOfferingView && (<><PriceOfferingViewPanel data={$d} handlers={$h} /></>)
            || panel === Panel.AuctionView && (<><AuctionViewPanel data={$d} handlers={$h} /></>)
            || (<>
                <div>Error Panel not available</div>
            </>) 
        }
    </>)
}

const SellSetupPanel = ({ data, handlers }: any) => {
    return (<div>
        <SetupPriceOfferingSellButton data={data} handlers={handlers} />
        <SetupAuctionButton data={data} handlers={handlers} />
        {/* <PriceInputPanel data={data} handlers={handlers} /> */}
        {/* <SetReadyToSellTokenButton data={data} handlers={handlers} /> */}
        {/* <CancelSellTokenButton data={data} handlers={handlers} /> */}
    </div>)
}


/* 

*/

const SetupPriceOfferingSellButton = ({ data, handlers }: any) => {

    const { setPanel } = handlers;

    const handler = (data: any, handlers: any) => {
        setPanel(Panel.PriceOfferingSetup)
    }

    return (
        <>
            <button
                className="btn-default __icon"
                onClick={() => handler(data, handlers)}
            >
                {/* <FaCheck /> */}
                <span className="ml-2">Start Price Offering Sell</span>
            </button>
        </>
    )
}

/* 

*/

const SetupAuctionButton = ({ data, handlers }: any) => {

    const { setPanel } = handlers;

    const handler = (data: any, handlers: any) => {
        setPanel(Panel.AuctionSetup)
    }

    return (
        <>
            <button
                className="btn-default __icon"
                onClick={() => handler(data, handlers)}
            >
                {/* <FaCheck /> */}
                <span className="ml-2">Start an Auction</span>
            </button>
        </>
    )
}

/* 

*/

const PriceOfferingSetupPanel = ({ data, handlers }: any) => {
    const { contracts } = useEthersContext();
    const { $result, $error, $finalizer } = $processor({ data, handlers })

    const { id: uuid, tokenID: artworkTokenId, processing, currencyToken } = data;
    const { setPanel, setResult, setError, setProcessing } = handlers;
    const [ startDate, setStartDate ] = useState(new Date());
    const [ price, setPrice ] = useState("0");
    const [ quoteTokenAddress, setQuoteTokenAddress ] = useState(currencyToken.address);

    const handleClose = () => {
        setPanel(Panel.Main)
    }

    const handlePickDate = (_time: any) => {
        // console.log("Set Start Date", _time)
        if (_time.getTime() > new Date().getTime()) {
            setStartDate(_time) // TODO: Add time offset for at least 5 minute
        } else {
            alert("You have to choose only present or future time.")
        }
    }

    const handleOnChangePriceInput = ({ target }: any) => {
        const { value } = target;
        const _price: string = (value * 10 ** 18).toString()
        // console.log("handleOnChangePriceInput", value, "=>", _price)
        setPrice(_price)
    }
    
    const handleChangeCurrency = ({ target }: any) => {
        const { value } = target;
        setQuoteTokenAddress(value);
    }


    const handlers_ = { ...handlers, handleOnChangePriceInput, handleChangeCurrency }

    const handleSetupPriceOffering = async (data: any, handler: any) => {
    
        try {
            const _startTime = Math.round(startDate.getTime() / 1000)
            const now = new Date().getTime()
            const __startTime = _startTime <= now + 60 ? _startTime + 60 : _startTime
            const _price = ethers.utils.parseUnits(price, 'wei')

            setProcessing({ ...processing, isProcessing: true, isLoading: true })
            const tx = await contracts.NFTMARKET.setPriceOfferingSell(artworkTokenId, __startTime, _price, quoteTokenAddress)
            
            tx.wait()
            .then((resultTx: any) => {
                setResult(tx, resultTx)
                setArtworkSellingData(uuid, SellingType.OFFERING, { price: _price, currencyToken }, { startTime: __startTime })
                setPanel(Panel.Main)
            })
            .catch($error)
            .finally($finalizer)
        } catch (error) {
            console.log(error)
            setError(Error)
            $finalizer()
        }
    }

    return (<>

        <div id="container-detail" className="item-container">
            <div className="item-wrapper">
    
                <div className="item-wrapper-content">
                    {/* <div className="detail-panel"> */}
                    <div className="bid-info">
                        <div id="gallery-detail" className="gallery-container" >
                            <div className="gallery-wrapper">
                                <figure className="gallery-wrapper-content">
                                    <img src={data.resource.origin} alt="" />
                                </figure>
                            </div>
                        </div>
                    </div>
    
                    <div id="price-offering-panel" className="interaction-panels">
                        <div className="_close-panel">
                            <button
                                className="btn-default __icon"
                                onClick={() => handleClose()}
                            >
                                <ImCross />
                            </button>
                        </div>
    
                        <div className="_setup-panel">
                            <div className="">
                                <div>
                                    <h1 className="_title text-black">Setup Price Offering</h1>
                                    <br />
                                    <h5 className="text-black">
                                        Set the price you want to sell and time to start selling
                                        <br />
                                        Buyers can name the price they want
                                        and you can select which one satisfy you the most.
                                    </h5>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="text-black">Price</h5>
                                    <PriceInputPanel data={{ ...data, label: "Put your expected price" }} handlers={handlers_} />

                                    <h5 className="text-black">Day to begin</h5>
                                    <div
                                        className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto"
                                    >
                                        <DateTimePicker
                                            value={startDate}
                                            onChange={value => handlePickDate(value)}
                                            className="rainbow-m-around_small"
                                            hour24
                                        />
                                    </div>
                                    {/* <PriceInputPanel data={{ ...data, label: "Put your expected price" }} handlers={handlers} /> */}
                                </div>
                            </div>

                            <div className="bid-entry-list">
                                <div className="_actions">

                                    <div className="button-group mb-4">
                                        <div className="button-group-content">                  
                                            <button
                                                className="btn-default __icon"
                                                onClick={() => handleSetupPriceOffering(data, handlers)}
                                            >
                                                <FaHandPointUp />
                                                <span>{`Comfirm`}</span>
                                            </button>

                                            <button
                                                className="btn-default __icon"
                                                onClick={() => handleClose()}
                                            >
                                                <FaHandPointUp />
                                                <span>{`Cancel`}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export function setArtworkSellingData(id: any, sellingType: SellingType, pricing: any, time?: any) {
    const { currencyToken, price } = pricing
    console.log("setArtworkSellingData", id, sellingType, pricing, time)
    const workDocRef = firestore.collection('works').doc(id)

    let price_ = null 

    if (pricing) {
        price_ = {
            amount: price.toString(),
            hex: price.toHexString(),
            currencyToken: { ...currencyToken, address: safeAddress(currencyToken.address) }
        }
    }

    const data_ = {
        price: price_,
        sellingType,
        sellingTime: time
    }

    workDocRef.set(data_, { merge: true })
    .then((_result: any) => console.log)
    .catch((_error: any) => console.error)
}

/* 

*/

const AuctionSetupPanel = ({ data, handlers }: any) => {
    const { contracts } = useEthersContext();
    const now = new Date()
    const endTimeOffset = 24*60*60*1000 // 1 day by default

    const { tokenID: artworkTokenId, processing } = data;
    const { setPanel, setResult, setError, setIsLoading, setProcessing } = handlers;
    const [ startDate, setStartDate ] = useState(now);
    const [ endDate, setEndDate ] = useState(new Date(now.getTime() + endTimeOffset));
    const [ price, setPrice ] = useState("0");
    const [ quoteTokenAddress, setQuoteTokenAddress ] = useState(data.currencyToken.address);

    const handleClose = () => {
        setPanel(Panel.Main)
    }

    const handlePickDate = (_time: any) => {
        // console.log("Set Start Date", _time)
        if (_time.getTime() > new Date().getTime()) {
            setStartDate(_time) // TODO: Add time offset for at least 5 minute
        } else {
            alert("You have to choose only present or future time.")
        }
    }

    const handlePickEndDate = (_time: any) => {
        // console.log("Set Start Date", _time)
        if (_time.getTime() > new Date().getTime()) {
            setEndDate(_time) // TODO: Add time offset for at least 5 minute
        } else {
            alert("You have to choose only present or future time.")
        }
    }

    const handleOnChangePriceInput = ({ target }: any) => {
        const { value } = target;
        const _price: string = (value * 10 ** 18).toString()
        // console.log("handleOnChangePriceInput", value, "=>", _price)
        setPrice(_price)
    }
    
    const handleChangeCurrency = ({ target }: any) => {
        const { value } = target;
        setQuoteTokenAddress(value);
    }

    const handlers_ = { ...handlers, handleOnChangePriceInput, handleChangeCurrency }

    const handleSetupAuction = async (data: any, handler: any) => {
        const { $result, $error, $finalizer } = $processor({ data, handlers })
        const { setProcessing } = handlers

        try {
            const now = new Date().getTime()
            const _startTime = Math.round(startDate.getTime() / 1000)
            const __startTime = _startTime <= now + 60 ? _startTime + 60 : _startTime

            const _endTime = Math.round(endDate.getTime() / 1000)
            const __endTime = _endTime <= now + 60 ? _endTime + 60 : _endTime

            const _price = ethers.utils.parseUnits(price, 'wei')

            setProcessing({ ...processing, isProcessing: true, isLoading: true })

            const tx = await contracts.NFTMARKET.setAuctionSell(
                artworkTokenId, __startTime, __endTime, _price, quoteTokenAddress    
            )

            tx.wait()
            .then((resultTx: any) => {
                setResult(tx, resultTx)
                handleClose()
            })
            .catch($error)
            .finally($finalizer)

        } catch (error) {
            console.error(error)
            setError(error)
            $finalizer()
        }
    }

    return (<>

        <div id="container-detail" className="item-container">
            <div className="item-wrapper">
    
                <div className="item-wrapper-content">
                    {/* <div className="detail-panel"> */}
                    <div className="bid-info">
                        <div id="gallery-detail" className="gallery-container" >
                            <div className="gallery-wrapper">
                                <figure className="gallery-wrapper-content">
                                    <img src={data.resource.origin} alt="" />
                                </figure>
                            </div>
                        </div>
                    </div>
    
                    <div id="price-offering-panel" className="interaction-panels">
                        <div className="_close-panel">
                            <button
                                className="btn-default __icon"
                                onClick={() => handleClose()}
                            >
                                <ImCross />
                            </button>
                        </div>
    
                        <div className="_setup-panel">
                            <div className="">
                                <div>
                                    <h1 className="_title text-black">Setup Auction</h1>
                                    <br />
                                    <h5 className="text-black">
                                        Set the price you want to start (minimum for the first bid) and time to start and end this auction.
                                        <br />
                                        Buyers can bid with their price higher than the previous bid.
                                        <br />
                                        The winner will be whom that bid the most at the end time.
                                    </h5>
                                </div>
                                
                                <div className="mt-4">
                                    <h5 className="text-black">Start Price</h5>
                                    <PriceInputPanel data={{ ...data, label: "Put your expected price" }} handlers={handlers_} />

                                    <h5 className="text-black">Day to begin</h5>
                                    <div
                                        className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto"
                                    >
                                        <DateTimePicker
                                            value={startDate}
                                            onChange={value => handlePickDate(value)}
                                            className="rainbow-m-around_small"
                                            hour24
                                        />
                                    </div>
                                    <h5 className="text-black">Day for end this auction</h5>
                                    <div
                                        className="rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto"
                                    >
                                        <DateTimePicker
                                            value={endDate}
                                            onChange={value => handlePickEndDate(value)}
                                            className="rainbow-m-around_small"
                                            hour24
                                        />
                                    </div>
                                    {/* <PriceInputPanel data={{ ...data, label: "Put your expected price" }} handlers={handlers} /> */}
                                </div>
                            </div>

                            <div className="bid-entry-list">
                                <div className="_actions">

                                    <div className="button-group mb-4">
                                        <div className="button-group-content">                  
                                            <button
                                                className="btn-default __icon"
                                                onClick={() => handleSetupAuction(data, handlers)}
                                            >
                                                <FaHandPointUp />
                                                <span>{`Comfirm`}</span>
                                            </button>

                                            <button
                                                className="btn-default __icon"
                                                onClick={() => handleClose()}
                                            >
                                                <FaHandPointUp />
                                                <span>{`Cancel`}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                    </div>
                </div>
            </div>
        </div>
    </>)
}

/* 

*/

/* 

*/

const BidPanel = ({ data, handlers }: any) => {
    const { account, contracts, tokenID: NFTTokenId, currencies } = data
    const { handleSetBidding } = handlers
    const { NFTMARKET } = contracts
    const [ bidHistory, setBidHistory ] = useState([])
    const [ isAlreadyBid, setIsAlreadyBid ] = useState(false)

    // Get Latest Bid Entry of
    const getBids = async () => {
        try {
            const _result = await NFTMARKET.getBids(NFTTokenId)
            const _length = await NFTMARKET.getBidsLength(NFTTokenId)
            const _user = await NFTMARKET.getUserBids(account)
            // console.log("getBids", _result, _length, _user)

            return _result
        } catch (error) {
            console.error("getBids", error)
        }
    }

    const handleBidHistory = async () => {
        const _result: [] = await getBids()
        if (_result && _result.length > 0) {
            setBidHistory([..._result])
            checkIsUserAlreadyBid( _result)
        }
    }

    const checkIsUserAlreadyBid = (_bidEntries: any) => {
        if (_bidEntries.find((el: any) => safeAddress(el[0]) === safeAddress(account))) {
            setIsAlreadyBid(true)
            return true
        }
        setIsAlreadyBid(false)
        return false
    }

    useEffect(() => {
        (async () => {
                await handleBidHistory()
        })()
    }, [])

    const handlers_ = { ...handlers, handleBidHistory }

    return (<>

    <div id="container-detail" className="item-container">
        <div className="item-wrapper">

            <div className="item-wrapper-content">
                {/* <div className="detail-panel"> */}
                <div className="bid-info">
                    <div id="gallery-detail" className="gallery-container" >
                        <div className="gallery-wrapper">
                            <figure className="gallery-wrapper-content">
                                <img src={data.resource.origin} alt="" />
                            </figure>
                        </div>
                    </div>

                </div>

                <div id="bid-panel">
                    <div className="_close-panel">
                        <button
                            className="btn-default __icon"
                            onClick={() => handleSetBidding(false)}
                        >
                            <ImCross />
                        </button>
                    </div>

                    <div className="bid-history-pane">
                        <h5 className="_title">Bid Entry</h5>
                        <div className="bid-entry-list">
                            {
                                bidHistory && bidHistory.length > 0
                                ? bidHistory
                                    .sort((a: any, b: any): any => {
                                        if (a.price < b.price) return 1;
                                        if (a.price > b.price) return -1;
                                        if (a.timestamp.toNumber() < b.timestamp.toNumber()) return -1;
                                        if (a.timestamp.toNumber() > b.timestamp.toNumber()) return 1;
                                    })
                                    .map((item: any, index: number) => {
                                        const bidder = item.bidder
                                        const price = item.price.toString()
                                        const tokenAddress = safeAddress(item.quoteTokenAddr)
                                        const currency = currencies[tokenAddress]
                                        const symbol = currency ? currency.symbol : "Unknown" 
                                        const timestamp = item.timestamp.toNumber() * 1000

                                        return (<div className="bid-entry" key={index}>
                                            <span className="_pricetag">
                                                <span className="_price">{ price } </span> 
                                                <span className="_symbol" data-token-address={tokenAddress}>{ symbol }</span>
                                            </span>
                                            <span>
                                                <span className="_address"> by <AddressMask address={bidder} /></span>
                                                <span className="_address"> at { new Date(timestamp).toLocaleString() }</span>
                                            </span>
                                        </div>)
                                })
                                : (<h3>No one has bid yet.</h3>)
                            }
                        </div>
                    </div>

                    <div className="_actions">
                        <PriceInputPanel data={data} handlers={handlers} />
                        <div className="button-group">
                            <div className="button-group-content">
                            {
                                !isAlreadyBid
                                    ? (<BidNFTTokenButton data={data} handlers={handlers_} />)
                                    : (<UpdateBidNFTTokenButton data={data} handlers={handlers_} />)
                            }
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
        </div>
    </div>
    </>)
}

/* 
 Price Offering Panel
*/

const PriceOfferingViewPanel = ({ data, handlers }: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { account, contracts, tokenID: NFTTokenId, currencies, artworkTokenSeller, userRole, uuid, processing } = data
    const { handleSetBidding, handleSetOfferingPanel, setPanel, setProcessing } = handlers

    const { NFTMARKET } = contracts
    const [ bidHistory, setBidHistory ] = useState([])
    const [ isAlreadyBid, setIsAlreadyBid ] = useState(false)

    // Get Latest Offers of
    const getBids = async () => {
        try {
            const _result = await NFTMARKET.getBids(NFTTokenId)
            const _length = await NFTMARKET.getBidsLength(NFTTokenId)
            const _user = await NFTMARKET.getUserBids(account)
            // console.log("getBids", _result, _length, _user)

            return _result
        } catch (error) {
            console.error("getBids", error)
        }
    }

    const handleBidHistory = async () => {
        const _result: [] = await getBids()
        if (_result && _result.length > 0) {
            setBidHistory([..._result])
            checkIsUserAlreadyBid( _result)
        }
    }

    const checkIsUserAlreadyBid = (_bidEntries: any) => {
        if (_bidEntries.find((el: any) => safeAddress(el[0]) === safeAddress(account))) {
            setIsAlreadyBid(true)
            return true
        }
        setIsAlreadyBid(false)
        return false
    }

    const handleSellOffer = async (address: string) => {
        try {
            setProcessing({ ...processing, isProcessing: true, isLoading: true })
            const tx = await NFTMARKET.sellTokenTo(NFTTokenId, address)

            tx.wait()
            .then((txResult: any) => {
                console.log(txResult)
                // Reload Page
                transferWorkOwnership(uuid, account, address)
                // setResult({ tx, txResult })
                setPanel(Panel.Main)
            })
            .catch($error)
            .finally($finalizer)

        } catch (error) {
            console.error(error)
        }
        
    }

    useEffect(() => {
        (async () => {
                await handleBidHistory()
        })()
    }, [])

    const handlers_ = { ...handlers, handleBidHistory }

    return (<>

    <div id="container-detail" className="item-container">
        <div className="item-wrapper">

            <div className="item-wrapper-content">
                {/* <div className="detail-panel"> */}
                <div className="bid-info">
                    <div id="gallery-detail" className="gallery-container" >
                        <div className="gallery-wrapper">
                            <figure className="gallery-wrapper-content">
                                <img src={data.resource.origin} alt="" />
                            </figure>
                        </div>
                    </div>

                </div>

                <div id="bid-panel">
                    <div className="_close-panel">
                        <button
                            className="btn-default __icon"
                            onClick={() => handleSetOfferingPanel(false)}
                        >
                            <ImCross />
                        </button>
                    </div>

                    <div className="bid-history-pane">
                        <h5 className="_title">Offers</h5>
                        <div className="bid-entry-list">
                            {
                                bidHistory && bidHistory.length > 0
                                ? bidHistory
                                    .sort((a: any, b: any): any => {
                                        if (a.price < b.price) return 1;
                                        if (a.price > b.price) return -1;
                                        if (a.timestamp.toNumber() < b.timestamp.toNumber()) return -1;
                                        if (a.timestamp.toNumber() > b.timestamp.toNumber()) return 1;
                                    })
                                    .map((item: any, index: number) => {
                                        const bidder = item.bidder
                                        const price = (item.price / (10**18)).toFixed(2).toString()
                                        const tokenAddress = item.quoteTokenAddr.toLowerCase()
                                        const currency = currencies[tokenAddress]
                                        const symbol = currency ? currency.symbol : "Unknown" 
                                        const timestamp = item.timestamp.toNumber() * 1000

                                        return (<div className="bid-entry" key={index}>
                                            <span className="_pricetag">
                                                <span className="_price">{ price } </span> 
                                                <span className="_symbol" data-token-address={tokenAddress}>{ symbol }</span>
                                                <span className="_address"> by
                                                    {
                                                        safeAddress(account) === safeAddress(bidder)
                                                        ? (<span> you </span>)
                                                        : (<span> <AddressMask address={bidder} /></span>)
                                                    }
                                                </span>
                                                <span className="_address"> at { new Date(timestamp).toLocaleString() }</span>
                                            </span>
                                            {
                                                userRole === UserRole.Seller && (<button className="button-small" onClick={ () => handleSellOffer(bidder) } >Sell Now</button>)
                                            }
                                        </div>)
                                })
                                : (<h3>No one has bid yet.</h3>)
                            }
                        </div>
                    </div>

                    <div className="_actions">

                        {
                            safeAddress(artworkTokenSeller) !== safeAddress(account) && (<>
                                {/* <span className="text-black">{ artworkTokenSeller }</span> */}
                                <PriceInputPanel data={data} handlers={handlers} />
                                <div className="button-group">
                                    <div className="button-group-content">
                                    {/* {
                                        !isAlreadyBid
                                            ? (<BidNFTTokenButton data={data} handlers={handlers_} />)
                                            : (<UpdateBidNFTTokenButton data={data} handlers={handlers_} />)
                                    } */}
                                    {
                                        !isAlreadyBid
                                            ? (<PlaceOfferButton data={data} handlers={handlers_} />)
                                            : (<UpdatePriceOfferButton data={data} handlers={handlers_} />)
                                    }
                                    </div>
                                </div>
                            </>)
                        }
                    </div>
                </div>
                {/* </div> */}
            </div>
        </div>
    </div>
    </>)
}

/* 
    Transfer Work's Ownership
*/

export function transferWorkOwnership (id: string, owner: string, newOwner: string) {
    console.log("Transfer Work Ownership", id, owner, newOwner)
    const workDocRef = firestore.collection('works').doc(id)
    workDocRef.update({
        owner: safeAddress(newOwner),
        updated_at: $firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((_result: any) => console.log("Updated Work ID:", id, _result))
    .catch((_error: any) => console.error("Updated Work ID:", id, _error))



    const worksIndexOfOwnerDocRef = firestore.collection('works_index').doc(`user:${safeAddress(owner)}`)
    const worksIndexOfOwnerUpdatePayload = {} as any
    worksIndexOfOwnerUpdatePayload['list_own'] = {
        [id]: $firebase.firestore.FieldValue.delete(),
    }
    worksIndexOfOwnerUpdatePayload['updated_at'] = $firebase.firestore.FieldValue.serverTimestamp()

    worksIndexOfOwnerDocRef.set(worksIndexOfOwnerUpdatePayload, {merge: true})
    .then((_result: any) => console.log("Updated Work Index of Owner:", safeAddress(owner), _result))
    .catch((_error: any) => console.error("Updated Work Index of Owner:", safeAddress(id), _error))



    const worksIndexOfNewOwnerDocRef = firestore.collection('works_index').doc(`user:${safeAddress(newOwner)}`)
    const worksIndexOfNewOwnerUpdatePayload = {} as any
    worksIndexOfNewOwnerUpdatePayload['list_own'] = {
        [id]: {
            id,
            created_at: $firebase.firestore.FieldValue.serverTimestamp(),
        },
    }
    worksIndexOfNewOwnerUpdatePayload['updated_at'] = $firebase.firestore.FieldValue.serverTimestamp()

    worksIndexOfNewOwnerDocRef.set(worksIndexOfNewOwnerUpdatePayload, {merge: true})
    .then((_result: any) => console.log("Updated Work Index of Owner:", safeAddress(newOwner), _result))
    .catch((_error: any) => console.error("Updated Work Index of Owner:", safeAddress(newOwner), _error))
}


/* 
 Auction Panel
*/

const AuctionViewPanel = ({ data, handlers }: any) => {
    const { account, contracts, tokenID: NFTTokenId, currencies, currentPrice, currencyToken } = data
    const { handleSetBidding, handleSetOfferingPanel } = handlers
    const { NFTMARKET } = contracts
    const [ bidHistory, setBidHistory ] = useState([])
    const [ isAlreadyBid, setIsAlreadyBid ] = useState(false)

    const { artworkTokenSeller, sellEndTime } = data

    // Get Latest Offers of
    const getBids = async () => {
        try {
            const _result = await NFTMARKET.getBids(NFTTokenId)
            const _length = await NFTMARKET.getBidsLength(NFTTokenId)
            const _user = await NFTMARKET.getUserBids(account)
            // console.log("getBids", _result, _length, _user)

            return _result
        } catch (error) {
            console.error("getBids", error)
        }
    }

    const handleBidHistory = async () => {
        const _result: [] = await getBids()
        if (_result && _result.length > 0) {
            setBidHistory([..._result])
            checkIsUserAlreadyBid( _result)
        }
    }

    const checkIsUserAlreadyBid = (_bidEntries: any) => {
        if (_bidEntries.find((el: any) => safeAddress(el[0]) === safeAddress(account))) {
            setIsAlreadyBid(true)
            return true
        }
        setIsAlreadyBid(false)
        return false
    }

    useEffect(() => {
        (async () => {
                await handleBidHistory()
        })()
    }, [])

    const handlers_ = { ...handlers, handleBidHistory }

    return (<>

    <div id="container-detail" className="item-container">
        <div className="item-wrapper">

            <div className="item-wrapper-content">
                {/* <div className="detail-panel"> */}
                <div className="bid-info">
                    <div id="gallery-detail" className="gallery-container" >
                        <div className="gallery-wrapper">
                            <figure className="gallery-wrapper-content">
                                <img src={data.resource.origin} alt="" />
                            </figure>
                        </div>
                    </div>
                </div>

                <div id="bid-panel">
                    <div className="_close-panel">
                        <button
                            className="btn-default __icon"
                            onClick={() => handleSetOfferingPanel(false)}
                        >
                            <ImCross />
                        </button>
                    </div>

                    <div className="bid-history-pane">
                        <h5 className="_title">Bids</h5>
                        <div className="bid-entry-list">
                            {
                                bidHistory && bidHistory.length > 0
                                ? bidHistory
                                    .sort((a: any, b: any): any => {
                                        if (a.price < b.price) return 1;
                                        if (a.price > b.price) return -1;
                                        if (a.timestamp.toNumber() < b.timestamp.toNumber()) return -1;
                                        if (a.timestamp.toNumber() > b.timestamp.toNumber()) return 1;
                                    })
                                    .map((item: any, index: number) => {
                                        const bidder = item.bidder
                                        const price = (item.price / (10**18)).toFixed(2).toString()
                                        const tokenAddress = item.quoteTokenAddr.toLowerCase()
                                        const currency = currencies[tokenAddress]
                                        const symbol = currency ? currency.symbol : "Unknown" 
                                        const timestamp = item.timestamp.toNumber() * 1000

                                        return (<div className="bid-entry" key={index}>
                                            <span className="_pricetag">
                                                <span className="_price">{ price } </span> 
                                                <span className="_symbol" data-token-address={tokenAddress}>{ symbol }</span>
                                                <span className="_address"> by
                                                    {
                                                        safeAddress(account) === safeAddress(bidder)
                                                        ? (<span> you </span>)
                                                        : (<span> <AddressMask address={bidder} /></span>)
                                                    }
                                                </span>
                                                <span className="_address"> at { new Date(timestamp).toLocaleString() }</span>
                                            </span>
                                            <span>
                                            </span>
                                        </div>)
                                })
                                : (<h3>No one has bid yet.</h3>)
                            }
                        </div>
                    </div>

                    <div className="_actions">
                        {
                            safeAddress(artworkTokenSeller) !== safeAddress(account) && (<>
                                <div className="minimum-bid">
                                    <h5 className="minimum-bid text-black">Minimum bid {(currentPrice / 10e17).toFixed(2)} {currencyToken.symbol}</h5>
                                </div>
                                {/* <span className="text-black">{ artworkTokenSeller }</span> */}
                                <PriceInputPanel data={data} handlers={handlers} />
                                <div className="button-group">
                                    <div className="button-group-content">
                                    {/* {
                                        !isAlreadyBid
                                            ? (<BidNFTTokenButton data={data} handlers={handlers_} />)
                                            : (<UpdateBidNFTTokenButton data={data} handlers={handlers_} />)
                                    } */}
                                    {
                                        !isAlreadyBid
                                            ? (<PlaceBidButton data={data} handlers={handlers_} />)
                                            : (<UpdatePriceOfferButton data={data} handlers={handlers_} />)
                                    }
                                    </div>
                                </div>
                            </>)
                        }
                        <div className={`"timer" ${sellEndTime < new Date().getTime() && "_active"}`}>
                            <CountdownTimerDisplay epoch={sellEndTime} type="ending" />
                            {/* <div className="text-black">End in { Math.round(sellEndTime - (new Date().getTime() / 1000)) } ({ sellEndTime })</div> */}
                        </div>  
                    </div>
                </div>
                {/* </div> */}
            </div>
        </div>
    </div>
    </>)
}

/* 

*/
const CurrentPriceDisplay = ({ data, handlers }: any) => {
    const { currentPrice, currencyToken, sellingType } = data
    const decimals = currentPrice.length - 1
    const formatPrice = (parseInt(currentPrice) / (10 ** 18)).toFixed(4).toString()
    const float = formatPrice.split(".")[1] || ""
    // console.log(float.match(/0/g))
    // const padding = (float.match(/is/g) || []).length
    // if (formatPrice.includes("0.0")) {
        //     formatPrice = formatPrice.split("")
        // }
    // console.log(currentPrice, decimals, formatPrice, float)

    return (<>
        <div className="current-price">
            {
                sellingType 
                && sellingType === -1
                    ? "To see price, please setup MetaMask first"
                    : sellingType > 0
                        ? (<>{ formatPrice } { currencyToken.symbol}</>)
                        : "Not on sell"
            }
        </div>
    </>)
}

/* 

*/
const PriceInputPanel = ({ data, handlers }: any) => {
    
    const { price, currencyToken, currencies } = data
    const { handleOnChangePriceInput, handleChangeCurrency } = handlers

    return (<>
        <div className="price-input-panel">
            <h1>{ data?.label }</h1>
            <input
                onChange={handleOnChangePriceInput}
                required
                placeholder={`${price}`}
                type="number"
                step="0.001"
                // min={0.000_000_000_000_000_001}
            />

            <select
                id="formGridState"
                value={currencyToken.address}
                onChange={handleChangeCurrency}
            >
                {
                    Object.keys(currencies).map(k => <option key={k} value={k}>{ `${currencies[k].symbol}`}</option>)
                }
            </select>
        </div>
    </>)
}

/* 

*/
const ApproveForAllButton = ({ data, handlers }: any) => {
    const { account, contracts } = useEthersContext()

    return (
        <>
            <button
                className="btn-default __icon"
                onClick={() => handleSetApprovalForAll({ ...data, account, contracts }, handlers)}
            >
                <FaCheck />
                <span className="ml-2">Approve to Sell</span>
            </button>
            <span>You must approve before you can sell your work</span>
        </>
    )
}

/* 

*/
const handleSetApprovalForAll = async (data: any, handlers: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })

    const { processing, account, contracts } = data
    const { NFTWORK, NFTMARKET } = contracts
    
    const { setError, setResult, setIsLoading, setProcessing, handleApprovalForAllResult } = handlers

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!NFTWORK) { throw { message: "Artwork contract not available" } }
        if (!NFTMARKET) { throw { message: "Bid contract not available" } }

        processing.isProcessing = true
        processing.isLoading = true
        setProcessing(processing)
        const tx = await NFTWORK.setApprovalForAll(NFTMARKET.address, true)
        
        tx.wait()
        .then((txResult: any) => {
            handleApprovalForAllResult(tx)
            setResult(tx, txResult)
        })
        .catch($error)
        .finally($finalizer)
        
    } catch (error) {
        console.error(error)
        setResult(null)
        setError(error)
        $finalizer()
    }
}

/* 

*/
const ApproveCurrencyButton = ({ data, handlers }: any) => {

    return (
        <>
            <button
                className="btn-default __icon"
                onClick={() => handleApproveCurrencyToken(data, handlers)}
            >
                <FaCheck />
                <span className="ml-2">Approve {data.currencyToken.symbol}</span>
            </button>
            <span className="text-black">You must approve before you can buy</span>
        </>
    )
}

/* 
 
*/
const handleApproveCurrencyToken = async (data: any, handlers: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })

    const { processing, account, contracts, chain, currencies, currencyToken, price } = data
    const { setError, setResult, forceUpdate, setIsLoading, setProcessing } = handlers

    const { NFTWORK, NFTMARKET, artWork: ARTWORK, bid: BID } = contracts
    
    const tokenSmartContract = contracts[chain.code][safeAddress(currencyToken.address)]

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!currencyToken) { throw { message: `Invalid selected currency token => ${currencyToken}` } }
        if (!tokenSmartContract) { throw { message: `Invalid currency token smart contract object => ${tokenSmartContract}` }}

        const _price = ethers.utils.parseUnits("999999999999999999", 'ether')

        setProcessing({ ...processing, isProcessing: true, isLoading: true })
        const resultTx = await tokenSmartContract.approve(
            NFTMARKET.address,
            _price,
        )
            
        resultTx.wait()
        .then(async (r: any) => {
            setResult(resultTx, r)
        })
        .catch($error)
        .finally($finalizer)

    } catch (error) {
        console.error(error)
        setResult(null)
        setError(error)
        $finalizer()
    }
}


/* 
 
*/

const SetReadyToSellTokenButton = ({ data, handlers }: any) => {
    const { account = "0x0", contracts } = useEthersContext()

    const data__ = {
        ...data,
        account,
        contracts
    }

    return (
        <button
            className="btn-default __icon"
            onClick={() => handleSetReadyToSell(data__, handlers)}
        >
            <RiAuctionFill />
            <span className="ml-2">{`Set Work for Sell`}</span>
        </button>
    )
}


/*
*/
export const handleSetReadyToSell = async (data?: any, handlers?: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { processing, account, contracts, tokenID: artworkTokenId, artworkTokenOwner, price, currencyToken } = data

    const { setError, setResult, setIsLoading, setProcessing } = handlers
    const { NFTWORK, NFTMARKET } = contracts

    try {
        if (!account) { throw { internal: true, data: { code: -1, message: "Account is not available to create a new work" } } }
        if (!NFTWORK) { throw { internal: true, data: { code: -1,  message: "Artwork contract not available" } } }
        if (!NFTMARKET) { throw { internal: true, data: { code: -1, message: "Bid contract not available" } } }
        if (!artworkTokenId) {throw { internal: true, data: { code: -1, message: "Invalid Artwork Token Id" } } }
        if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { internal: true, data: { code: -1,  message: "Artwork is not own by this account" } } }
        if (!price) { throw { internal: true, data: { code: -1,  message: "Invalid price" } } }
        if (!currencyToken) { throw { internal: true, data: { code: -1,  message: "Invalid currency token" } } }
        setIsLoading(true)
        
        processing.isProcessing = true
        setProcessing(processing)
        const resultTx = await NFTMARKET.readyToSellToken(
            artworkTokenId,
            price,
            currencyToken.address
        )

        // TODO: Improve success result and transaction display.
        // alert(`Setup Sell Successfully \n with transaction hash: \n${resultTx.hash} \nYou may need to wait a little bit to see result`)
            // console.info("handleSetReadyToSell", resultTx)
            
        resultTx.wait()
            .then(async (r: any) => {
                setResult(resultTx, r)
                // alert(`Setup Sell Transaction successfully`)
                await NFTMARKET.getCurrentPrice(
                    artworkTokenId
                )
                setIsLoading(false)
            })
            .catch($error)
            .finally($finalizer)

    } catch (error) {
        if (error.internal) {
            alert(error.data.message)
        }
        if (error.data && error.data.code === 3) {
            if (error.data.message === "") {
                alert()
            }
            if (error.data.message === "execution reverted: Only Token Owner can sell token") {
                // alert("You're not a seller, maybe you've already setup sell, now you can only change sell price or cancel it.")
            }
        }
        // console.log(error)

        setResult(null)
        setError(error)
        setIsLoading(false)
        processing.isProcessing = true
    }
}

const CancelSellTokenButton = ({ data, handlers }: any) => {
    const { account, contracts } = useEthersContext()
    const { tokenID: artworkTokenId } = data

    const data__ = {
        ...data,
        account,
        contracts
    }

    return (
        <button
            className="btn-default __icon"
            onClick={() => handleCancelSelling(data__, handlers)}
        >
            <RiAuctionFill />
            <span >{`Cancel Sell`}</span>
        </button>
    )
}

export const handleCancelSelling = async (data?: any, handlers?: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { processing, account, contracts, tokenID: artworkTokenId } = data
    const { setError, setResult, setIsLoading, setProcessing } = handlers

    const { NFTMARKET } = contracts

    try {
        if (!account) { throw { internal: true, data: { code: -1, message: "Account is not available to create a new work" } } }
        if (!NFTMARKET) { throw { internal: true, data: { code: -1, message: "Bid contract not available" } } }
        if (!artworkTokenId) { throw { internal: true, data: { code: -1, message: "Invalid Artwork Token Id" } } }
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }
        setIsLoading(true)
        
        processing.isProcessing = true
        setProcessing(processing)
        const resultTx = await NFTMARKET.cancelSellToken(
            artworkTokenId
        )

        // TODO: Improve success result and transaction display.
            // alert(`Cancel sell successfully \n with transaction hash: \n${resultTx.hash} \nYou may need to wait a little bit to see result`)
            
        resultTx.wait()
            .then((r: any) => {
                setResult({ resultTx, r })
                // alert(`Cancel Sell Transaction successfully`)
                setIsLoading(false)
            })
            .catch($error)
            .finally($finalizer)

    } catch (error) {
        if (error.internal) {
            alert(error.data.message)
        }
        if (error.data && error.data.code === 3) {
            if (error.data.message === "execution reverted: Only Seller can cancel sell token") {
                alert("To cancel sell, you must be a seller and setup sell first.")
            }
        }
        // console.log(error)
        
        setResult(null)
        setError(error)
        setIsLoading(false)
        processing.isProcessing = true
    }
}


const UpdatePriceButton = ({ data, handlers }: any) => {
    const { account = "0x0", contracts } = useEthersContext()

    const data__ = {
        ...data,
        account,
        contracts
    }

    // const onClick = async () => {
    //     toggleSetSellingPricePopup(true)
    // }

    return (
        <button
            className="btn-default __icon"
            onClick={() => handleUpdateSellPrice(data__, handlers)}
        >
            <RiAuctionFill />
            <span >{`Change Selling Price`}</span>
        </button>
    )
}


/*
*/
export const handleUpdateSellPrice = async (data?: any, handlers?: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { processing, account, contracts, tokenID: artworkTokenId, artworkTokenOwner, price, currencyToken } = data

    const { setError, setResult, setIsLoading, setCurrentPrice, setProcessing } = handlers
    const { NFTWORK, NFTMARKET } = contracts

    try {
        if (!account) { throw { internal: true, data: { code: -1, message: "Account is not available to create a new work" } } }
        if (!NFTWORK) { throw { internal: true, data: { code: -1,  message: "Artwork contract not available" } } }
        if (!NFTMARKET) { throw { internal: true, data: { code: -1, message: "Bid contract not available" } } }
        if (!artworkTokenId) {throw { internal: true, data: { code: -1, message: "Invalid Artwork Token Id" } } }
        if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { internal: true, data: { code: -1,  message: "Artwork is not own by this account" } } }
        if (!price) { throw { internal: true, data: { code: -1,  message: "Invalid price" } } }
        if (!currencyToken) { throw { internal: true, data: { code: -1,  message: "Invalid currency token" } } }
        setIsLoading(true)
        processing.isProcessing = true
        setProcessing(processing)

        const resultTx = await NFTMARKET.setCurrentPrice(
            artworkTokenId,
            price,
            currencyToken.address
        )

        // TODO: Improve success result and transaction display.
        // alert(`Set currenct price successfully \n with transaction hash: \n${resultTx.hash} \nYou may need to wait a little bit to see result`)
            // console.info("handleSetReadyToSell", resultTx)
            
        resultTx.wait()
            .then(async (r: any) => {
                setResult({ resultTx, r })
                // alert(`Set currenct price transaction successfully`)
            // console.log(r)
            await NFTMARKET.getCurrentPrice(
                artworkTokenId
            )
            setIsLoading(false)
        })
        .catch($error)
        .finally($finalizer)

    } catch (error) {
        if (error.internal) {
            alert(error.data.message)
        }
        if (error.data && error.data.code === 3) {
            if (error.data.message === "") {
                alert()
            }
            if (error.data.message === "execution reverted: Only Token Owner can sell token") {
                alert("You're not a seller, maybe you've already setup sell, now you can only change sell price or cancel it.")
            }
        }
        // console.log(error)

        setResult(null)
        setError(error)
        setIsLoading(false)
        processing.isProcessing = true
    }
}


const SetAuctionButton = ({ id }: any) => {
    const history = useHistory()

    const onClick = async () => {
        history.push(`/creator/set-auction/${id}`)
    }

    return (
        <button
            className="btn-default __icon"
            onClick={onClick}
        >
            <RiAuctionFill />
            <span>{`Set Auction`}</span>
        </button>
    )
}

const BuyNFTTokenButton = ({ data, handlers }: any) => {
    const { currencyToken} = data

    return (
        <button
            className="btn-default __icon"
            onClick={() => handleBuyNFTToken(data, handlers)}
        >
            <FaCheck />
            <span>{`Buy now with ${currencyToken.symbol}`}</span>
        </button>
    )
}

const handleBuyNFTToken = async (data?: any, handlers?: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { processing, account, contracts, tokenID: NFTTokenId, artworkTokenOwner, price, currencyToken, uuid, owner } = data
    const { NFTWORK, NFTMARKET } = contracts


    // // console.log("handleBuyNFTToken", account, NFTTokenId, artworkTokenOwner, price)

    // // console.log("handleBidNFT", contracts)
    // console.log(NFTTokenId)

    const { setError, setResult, setIsLoading, setProcessing } = handlers

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!NFTWORK) { throw { message: "Artwork contract not available" } }
        if (!NFTMARKET) { throw { message: "Bid contract not available" } }
        if (!NFTTokenId) { throw { message: "Invalid NFT Token Id" } }
        if (safeAddress(artworkTokenOwner) === safeAddress(account)) { throw { message: "Artwork is own by this account" } }
        // if (!price) { throw { message: "Invalid price" } }
        if (!currencyToken) { throw { message: "Invalid currency token" } }

        setProcessing({ ...processing, isProcessing: true, isLoading: true })
        const tx = await NFTMARKET.buyToken(
            NFTTokenId
        )


            // alert(`Buy NFT Token successfully \n with transaction hash: \n${tx.hash} \nYou may need to wait a little bit to see result`)
            
        tx.wait()
            .then(async (resultTx: any) => {
                setResult({ tx, resultTx })
                // alert(`Set currenct price transaction successfully`)
            // console.log(r)
                transferWorkOwnership(uuid, owner, account)
            })
            .catch($error)
            .finally($finalizer)
        
    } catch (error) {
        // console.log(error)
        const { data } = error
        if (data && data.code === 3) {
            if (data.message === "execution reverted: ERC20: transfer amount exceeds balance") {
                alert(`Insufficienct balance amount of ${currencyToken.symbol} to buy.`)
            }
            if (data.message === "execution reverted: BEP20: transfer amount exceeds balance") {
                alert(`Insufficienct balance amount of ${currencyToken.symbol} to buy.`)
            }
            if (data.message === "execution reverted: Token not in sell book") {
                alert(`This NFT is not ready for sell.`)
            }
            if (data.message === "execution reverted: You must cancel your bid first") {
                alert(`You must cancel you price offering before buy now.`)
            }
        } 
        setResult(null)
        setError(error)
    } finally { $finalizer() }
}


const BidNFTTokenButton = ({ data, handlers }: any) => {
    // const { account, contracts } = useEthersContext()
    const { currencyToken } = data
    // const price = 100000000000000

    return (
        <button
            className="btn-default __icon"
            onClick={() => handleBidNFTToken(data, handlers)}
        >
            <FaHandPointUp />
            <span>{`Place Bid`}</span>
        </button>
    )
}

const PlaceOfferButton = ({ data, handlers }: any) => {
    // const { account, contracts } = useEthersContext()
    // const { currencyToken } = data
    // const price = 100000000000000

    return (
        <button
            className="btn-default __icon"
            onClick={() => handlePlaceOffer(data, handlers)}
        >
            <FaHandPointUp />
            <span>{`Place Offer Price`}</span>
        </button>
    )
}

const handleBidNFTToken = async (data?: any, handlers?: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { processing, account, contracts, tokenID: NFTTokenId, artworkTokenOwner, price, currencyToken } = data
    const { NFTWORK, NFTMARKET } = contracts

    // console.log("handleBidNFTToken", account, NFTTokenId, artworkTokenOwner, price)

    const { setError, setResult, setProcessing, handleBidHistory  } = handlers

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!NFTWORK) { throw { message: "Artwork contract not available" } }
        if (!NFTMARKET) { throw { message: "Bid contract not available" } }
        if (!NFTTokenId) { throw { message: "Invalid NFT Token Id" } }
        if ((artworkTokenOwner).toLowerCase() === (account).toLowerCase()) { throw { message: "Artwork is own by this account" } }
        if (!price) { throw { message: "Invalid price" } }
        if (!currencyToken) { throw { message: "Invalid currency token" } }
    
        setProcessing({ ...processing, isProcessing: true, isLoading: true })

        const resultTx = await NFTMARKET.bidToken(
            NFTTokenId,
            price
        )
            // alert(`Bid NFT Token successfully at ${price} ${currencyToken.symbol} \n with transaction hash: \n${resultTx.hash} \nYou may need to wait a little bit to see result`)
            
        resultTx.wait()
            .then(async (r: any) => {
                setResult({ resultTx, r })
                await handleBidHistory()
            // alert(`Set currenct price transaction successfully`)
            // console.log(r)
            })
            .catch($error)
            .finally($finalizer)

        setError(null)
        setResult(resultTx)
    } catch (error) {
        console.log(error)
        const { data } = error
        if (data && data.code === 3) {
            if (data.message === "execution reverted: ERC20: transfer amount exceeds balance") {
                alert(`Insufficienct balance amount of ${currencyToken.symbol} to buy.`)
            }
            if (data.message === "execution reverted: Token not in sell book") {
                alert(`This NFT is not ready for sell.`)
            }
        } 
        setResult(null)
        setError(error)
        $error(error)
        $finalizer()
    }
}


const handlePlaceOffer = async (data?: any, handlers?: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { processing, account, contracts, tokenID: NFTTokenId, artworkTokenOwner, price, currencyToken, currentPrice } = data
    const { NFTWORK, NFTMARKET } = contracts

    // console.log("handleBidNFTToken", account, NFTTokenId, artworkTokenOwner, price)

    const { setError, setResult, setPanel, setProcessing, handleBidHistory  } = handlers

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!NFTWORK) { throw { message: "Artwork contract not available" } }
        if (!NFTMARKET) { throw { message: "Bid contract not available" } }
        if (!NFTTokenId) { throw { message: "Invalid NFT Token Id" } }
        if ((artworkTokenOwner).toLowerCase() === (account).toLowerCase()) { throw { message: "Artwork is own by this account" } }
        if (!price) { throw { message: "Invalid price" } }
        if (!currencyToken) { throw { message: "Invalid currency token" } }
    
        // const _price: string = (parseInt(value) * 10 ** 18).toString()
        const _price = ethers.utils.parseUnits(price, 'wei');
        console.log("NFT Token Id", NFTTokenId)
        

        setProcessing({ ...processing, isProcessing: true, isLoading: true })
        const tx = await NFTMARKET.offerToken(
            NFTTokenId,
            _price
        )

            // alert(`Bid NFT Token successfully at ${price} ${currencyToken.symbol} \n with transaction hash: \n${tx.hash} \nYou may need to wait a little bit to see result`)
            
        tx.wait()
            .then(async (txResult: any) => {
                console.log("Price", currentPrice, _price, currentPrice === _price)
                setResult({ tx, txResult })
                if (_price >= currentPrice) {
                    setPanel(Panel.Main)
                }
                await handleBidHistory()
                // alert(`Set currenct price transaction successfully`)
            })
            .catch($error)
            .finally($finalizer)
        
        setError(null)
        setResult(tx)
    } catch (error) {
        console.log(error)
        const { data } = error
        if (data && data.code === 3) {
            if (data.message === "execution reverted: ERC20: transfer amount exceeds balance") {
                alert(`Insufficienct balance amount of ${currencyToken.symbol} to buy.`)
            }
            if (data.message === "execution reverted: Token not in sell book") {
                alert(`This NFT is not ready for sell.`)
            }
            if (data.message === "execution reverted: 0::Cannot bid before start selling time") {
                alert(`You can't offer your price before selling time`)
            }
        } 
        setResult(null)
        setError(error)
        $finalizer()
    }
}


const UpdateBidNFTTokenButton = ({ data, handlers }: any) => {

    return (
        <button
            className="btn-default __icon"
            onClick={() => handleUpdateBidNFTToken(data, handlers)}
        >
            <FaHandPointUp />
            <span>{`Update Your Price`}</span>
        </button>
    )
}

const handleUpdateBidNFTToken = async (data?: any, handlers?: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { processing, account, contracts, tokenID: NFTTokenId, artworkTokenOwner, price, currencyToken } = data
    const { NFTMARKET } = contracts

    const { setError, setResult, setIsLoading, setProcessing, handleBidHistory } = handlers

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!NFTMARKET) { throw { message: "Bid contract not available" } }
        if (!NFTTokenId) { throw { message: "Invalid Artwork Token Id" } }


        setProcessing({ ...processing, isProcessing: true, isLoading: true })
        const resultTx = await NFTMARKET.updateBidPrice(
            NFTTokenId,
            price,
        )

        // alert(`Bid NFT Token successfully at ${price} ${currencyToken.symbol} \n with transaction hash: \n${resultTx.hash} \nYou may need to wait a little bit to see result`)
        // console.info(resultTx)
            
        resultTx.wait()
        .then(async (r: any) => {
            setResult({ resultTx, r })
            await handleBidHistory()
        })
        .catch($error)
        .finally($finalizer)
        
    } catch (error) {
        setResult(null)
        setError(error)
        $finalizer()
    }
}

const UpdatePriceOfferButton = ({ data, handlers }: any) => {

    return (
        <button
            className="btn-default __icon"
            onClick={() => { handleUpdatePriceOffer(data, handlers)} }
        >
            <FaHandPointUp />
            <span>{`Update Your Offer`}</span>
        </button>
    )
}


const handleUpdatePriceOffer = async (data?: any, handlers?: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { processing, account, contracts, tokenID: NFTTokenId, artworkTokenOwner, price, currencyToken } = data
    const { NFTMARKET } = contracts

    const { setError, setResult, setIsLoading, setProcessing, handleBidHistory } = handlers


    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!NFTMARKET) { throw { message: "Bid contract not available" } }
        if (!NFTTokenId) { throw { message: "Invalid Artwork Token Id" } }

        const _price = ethers.utils.parseUnits(price, 'wei');

        console.log("Check is processing", processing)
        const processing_ = { ...processing }
        processing_.isProcessing = true
        processing_.isLoading = true
        setProcessing(processing_)
        console.log("Check is processing", processing)

        const tx = await NFTMARKET.updateOfferPrice(NFTTokenId, _price)
        tx.wait().then((resultTx: any) => {
            // alert(`Bid NFT Token successfully at ${price} ${currencyToken.symbol} \n with transaction hash: \n${resultTx.hash} \nYou may need to wait a little bit to see result`)
            console.info(tx, resultTx)
            setProcessing({ ...processing, isProcessing: true, isLoading: true })
            $result({ tx, resultTx })
            return handleBidHistory()
        })
        .then((result: any) => {
            console.log("handleBidHistory", result)
        })
        .catch($error)
        .finally($finalizer)
        
    } catch (error) { $error(error) }
}


const PlaceBidButton = ({ data, handlers }: any) => {
    const history = useHistory()

    return (
        <button
            className="btn-default __icon"
            onClick={() => handlePlaceBid(data, handlers)}
        >
            <FaHandPaper />
            <span>{`Place a bid`}</span>
        </button>
    )
}


const handlePlaceBid = async (data?: any, handlers?: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { processing, account, contracts, tokenID: NFTTokenId, artworkTokenOwner, price, currencyToken } = data
    const { NFTWORK, NFTMARKET } = contracts

    // console.log("handleBidNFTToken", account, NFTTokenId, artworkTokenOwner, price)

    const { setError, setResult, setIsLoading, setProcessing, handleBidHistory  } = handlers

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        if (!NFTWORK) { throw { message: "Artwork contract not available" } }
        if (!NFTMARKET) { throw { message: "Bid contract not available" } }
        if (!NFTTokenId) { throw { message: "Invalid NFT Token Id" } }
        if ((artworkTokenOwner).toLowerCase() === (account).toLowerCase()) { throw { message: "Artwork is own by this account" } }
        if (!price) { throw { message: "Invalid price" } }
        if (!currencyToken) { throw { message: "Invalid currency token" } }
    
        // const _price: string = (parseInt(value) * 10 ** 18).toString()
        const _price = ethers.utils.parseUnits(price, 'wei');
        console.log("NFT Token Id", NFTTokenId)

        setProcessing({ ...processing, isProcessing: true, isLoading: true })
        const tx = await NFTMARKET.bidToken(
            NFTTokenId,
            _price
        )
        // alert(`Bid NFT Token successfully at ${price} ${currencyToken.symbol} \n with transaction hash: \n${tx.hash} \nYou may need to wait a little bit to see result`)
            
        tx.wait()
        .then(async (txResult: any) => {
            setResult({ tx, txResult })
            setError(null)
            await handleBidHistory()
        })
        .catch($error)
        .finally($finalizer)
        

    } catch (error) {
        console.log(error)
        const { data } = error
        if (data && data.code === 3) {
            if (data.message === "execution reverted: ERC20: transfer amount exceeds balance") {
                alert(`Insufficienct balance amount of ${currencyToken.symbol} to buy.`)
            }
            if (data.message === "execution reverted: Token not in sell book") {
                alert(`This NFT is not ready for sell.`)
            }
            if (data.message === "execution reverted: 0::Cannot bid before start selling time") {
                alert(`You can't offer your price before selling time`)
            }
            if (data.message === "execution reverted: Bid must be granter than start price") {
                alert(`You must bid more than start price`)
            }
        } 
        setResult(null)
        setError(error)
        $finalizer()
    }
}


/*  

*/
export const handleBidToken = async (data?: any, handlers?: any) => {
    const { $result, $error, $finalizer } = $processor({ data, handlers })
    const { processing, account, contracts, artworkTokenId, artworkTokenOwner, price, currencyToken } = data
    const { artWork: ARTWORK, bid: BID } = contracts
    const { setError, setResult, setProcessing } = handlers

    try {
        if (!account) { throw { message: "Account is not available to create a new work" } }
        // if (!ARTWORK) { throw { message: "Artwork contract not available" } }
        if (!BID) { throw { message: "Bid contract not available" } }
        if (!artworkTokenId) { throw { message: "Invalid Artwork Token Id" } }
        // if ((artworkTokenOwner).toLowerCase() !== (account).toLowerCase()) { throw { message: "Artwork is not own by this account" } }
        // if (!price) { throw { message: "Invalid price" } }
        // if (!currencyToken) { throw { message: "Invalid currency token" } }

        processing.isProcessing = true
        setProcessing(processing)
        const resultTx = await BID.bidToken(
            artworkTokenId,
            price
        )

        alert(`Bid NFT Token at ${price} ${currencyToken.symbol} successfully \n with transaction hash: \n${resultTx.hash} \nYou may need to wait a little bit to see result`)
        console.info(resultTx)

        setError(null)
        setResult(resultTx)
    } catch (error) {
        setResult(null)
        setError(error)
    } finally { $finalizer() }
}

const CreatorMiniDisplay = ({ creator }: any) => {
    return (<>
    {   creator ? (
            <div id="creator-mini" className="creator-container">
                <h3 className='text __txt-art'>
                    Creator
                </h3>
                <Link to={`/profile/${creator?.address}`} className="creator-wrapper">
                    <div className="creator-content">
                        <div className="creator-profile">
                            <img src={creator?.thumbnail} alt="" />
                        </div>
                        <div className="creator-detail">
                            <span className="text __txt-name">{ creator?.name }</span>
                            <span className="text __txt-at">{ AddressMask({ address: creator?.address }) }</span>
                        </div>
                    </div>
                </Link>
            </div>
        ) : (<></>)
    }
    </>)
}

const SetSellingPricePopup = (props: any) => {
    const { data, toggleSetSellingPricePopup } = props
    const { account, contracts } = useEthersContext()
    const { id, tokenID: artworkTokenId } = data
    const [price, setPrice] = useState(0)

    const currencyToken = "0x28322B766217c2364F21d28B0c2cdB38E47ABeb8"

    const el = {
        label: "Price",
        name: "New Price",
        id: "selling-price-setting-popup",
        placeholder: "0",
        type: "number"
    }

    const onChangePriceInput = ({ target }: any) => {
        if (target.value > 0) { setPrice(target.value) }
    }

    const onClickClose = () => {
        toggleSetSellingPricePopup(false)
    }

    const onClickSave = async () => {
        try {
            const result = await contracts.bid.setCurrentPrice(
                artworkTokenId,
                price.toString(),
                currencyToken,
            )
            toggleSetSellingPricePopup(false)
        } catch (e) {
            // console.log(e)
        }

        try {
            const updateResult = await firestore.collection("works").doc(id).update({
                price
            })
            // console.log(updateResult)

        } catch (e) {
            // console.log(e)
        }
    }

    return (
        <div className="interaction-popup selling-popup">

            <div className="_container">
                Set Selling Price
                <TextField label={el.label} onChange={onChangePriceInput} name={el.name} id={el.name} placeholder={el.placeholder} type={el.type} min="0" />

                <div className="group-btn">
                    <button
                        className="btn"
                        onClick={onClickSave}
                    >
                        <FaHandPaper />
                        <span className="ml-2">{`Set New Price`}</span>
                    </button>

                    <button
                        className="btn"
                        onClick={onClickClose}
                    >
                        <FaHandPaper />
                        <span className="ml-2">{`Close`}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

function warning(message: string) {
    alert(message)
}
