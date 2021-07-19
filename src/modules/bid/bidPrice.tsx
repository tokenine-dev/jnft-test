import { useState } from 'react'
import { BigNumber } from "@ethersproject/bignumber"
import { useEthersContext } from "providers/ethers";

export default function BidPrice() {
  const ethers = Object(useEthersContext());
  const gasLimit = 150000;

  /**
   * contract bidToken
   * @function handleSetCurrentPrice
   * @param _tokenId (uint256)
   * @param _price (uint256)
   *
   */
  const handleBidToken = async (_tokenId: number, _price: number) => {
    try {
      const num256 = _price * 10 ** 18;
      const price = BigNumber.from(num256.toString())
      const transaction = await ethers.contracts.bid.bidToken(_tokenId, price, {
        gasLimit,
      });
      const tx = await transaction.wait();
      return tx;
    } catch (e) {
      return e
    }
  };

  /**
   * contract setCurrentPrice
   * @function handleSetCurrentPrice
   * @param _tokenId (uint256)
   * @param _price (uint256)
   * @param _quoteTokenAddr (address)
   *
   */
  const handleSetCurrentPrice = async (
    _tokenId: number,
    _price: number,
    _quoteTokenAddr: string
  ) => {
    try {
      const num256 = _price * 10 ** 18;
      const price = BigNumber.from(num256.toString())
      const transaction = await ethers.contracts.bid.setCurrentPrice(
        _tokenId,
        price,
        _quoteTokenAddr,
        {
          gasLimit,
        }
      );
      const tx = await transaction.wait();
      return tx;
    } catch (e) {
      return e
    }
  };

  /**
   * contract updateBidPrice
   * @function handleUpdateBidPrice
   * @param _tokenId (uint256)
   * @param _price (uint256)
   *
   */
  const handleUpdateBidPrice = async (_tokenId: number, _price: number) => {
    try {
      const num256 = _price * 10 ** 18;
      const price = BigNumber.from(num256.toString())
      const transaction = await ethers.contracts.bid.updateBidPrice(
        _tokenId,
        _price,
        {
          gasLimit,
        }
      );
      const tx = await transaction.wait();
      return tx;
    } catch (e) {
      return e
    }
  };

  return {
    onBidToken: handleBidToken,
    onSetCurrentPrice: handleSetCurrentPrice,
    onUpdateBidPrice: handleUpdateBidPrice,
  };
}
