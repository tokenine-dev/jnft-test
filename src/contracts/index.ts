/* 
  TODOs:
  - Add Chain Config and Selector for Smart Contract Set
*/

import { safeAddress } from "utils/contract"
import abis from "./abi"


export const initialContracts: any = {
    "bsc-testnet": {
        // // NFT WORK
        // "0xAfdBEF5494C72579e918FE7427C9Ca097e704983": {
        //     chainId: 97,
        // },
        // NFT WORK (Proxy -- Pending)
        "0x44F053E55B143Dc6bcE71B41152b11761A7b1875": {
            chainId: 97,
        },
        // // NFT MARKET
        // "0x878131Cc65ef20F1C0FC4e078f7ca60191722B12": {
        //     chainId: 97,
        // },
        // NFT MARKET (Proxy -- Pending)
        "0x723e214Fc10DC30b1b4607996bCac9d919A72053": {
            chainId: 97,
        },
        // NFT AuctionHistory (Proxy -- Pending)
        // "0x4f774510665fd6E1daa5Cf7FF6b412f564451820": {
        "0x4Babf0c5122E64A3CcAb947334aB3bF30E6664A2": {
            chainId: 97,
        },
        // BEP-20 JVC-Peg JFIN-T (JFIN-T)
        // "0x1df0672a4553090573ffc1260f4e9fca8575d366": {
        //     chainId: 97,
        // },
        // BEP-20 Wrapped BNB (WBNB)
        // "0xae13d989dac2f0debff460ac112a837c89baa7cd": {
        //     chainId: 97
        // },
        // BEP-20 Fake JFIN (fJFIN)
        "0xF59b76a537AF7094D6CCF8810dA352dB4691D2e5": {
            chainId: 97
        }
    }
}

export const supportedChains: any = {

}

export const contracts: any = {}

export const loadContractLocal = async (_address: string) => {
    const address = safeAddress(_address)
    return await import(`./${address}.json`)
}

export const setupContract = (_address: string, opt: any = { local: true }) => {
    const address = safeAddress(_address)
    if (opt.local) { 
        loadContractLocal(address)
        .then(contract => {
            const { network } = contract
            if (!contracts[network]) contracts[network] = {}
            contracts[network][address] = contract
        })
    }
    return contracts
}

export {
    abis
}

export default {
    artWork: {
        address: "0xAfdBEF5494C72579e918FE7427C9Ca097e704983",
        abi: abis.mint,
    },
    bid: {
        address: "0x878131Cc65ef20F1C0FC4e078f7ca60191722B12",
        abi: abis.bid,
    },
    busd: {
        // address: "0xed24fc36d5ee211ea25a80239fb8c4cfd80f12ee",
        address: "0x28322B766217c2364F21d28B0c2cdB38E47ABeb8",
        abi: abis.ERC20,
    },
    // currencies: {
    // }
    "WBNB": {
        address: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
        abi: abis.ERC20,
    },
    "JFIN": {
        address: "0x1df0672a4553090573ffc1260f4e9fca8575d366",
        abi: abis.ERC20,
    },
    // "bsc-testnet": {
    // },
    // "bsc-mainnet": {

    // },
    "0x1df0672a4553090573ffc1260f4e9fca8575d366": {
        address: "0x1df0672a4553090573ffc1260f4e9fca8575d366",
        abi: abis.ERC20,
        type: "ERC20"
    },
    "0xae13d989dac2f0debff460ac112a837c89baa7cd": {
        address: "0xae13d989dac2f0debff460ac112a837c89baa7cd",
        abi: abis.ERC20,
        type: "ERC20"
    }
}
