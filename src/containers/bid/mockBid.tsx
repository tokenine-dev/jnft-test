import { useContext, Fragment } from "react";
//
import { AppStoreContext } from "hooks/context";
import { useEthersContext } from "providers/ethers";
//
export default function MockBid() {
  const ethers = Object(useEthersContext());
  const { walletState, walletActions } = Object(useContext(AppStoreContext));
  const { walletAddress } = walletState;
  const gasLimit = 150000;
  /**
   * function handleBidToken
   * contract bidToken
   *
   * @param _tokenId (uint256)
   * @param _price (uint256)
   *
   */
  const handleBidToken = async (_tokenId: number, _price: number) => {
    const transaction = await ethers.contracts.bid.bidToken(_tokenId, _price, {
      gasLimit,
    });
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleBuyToken
   * contract buyToken
   *
   * @param _tokenId (uint256)
   *
   */
  const handleBuyToken = async (_tokenId: number) => {
    const transaction = await ethers.contracts.bid.buyToken(_tokenId, {
      gasLimit,
    });
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleBuyTokenTo
   * contract buyTokenTo
   *
   * @param _tokenId (uint256)
   * @param _to (address)
   *
   */
  const handleBuyTokenTo = async (_tokenId: number, _to: string) => {
    const transaction = await ethers.contracts.bid.buyTokenTo(_tokenId, _to, {
      gasLimit,
    });
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleCancelBidToken
   * contract cancelBidToken
   *
   * @param _tokenId (uint256)
   *
   */
  const handleCancelBidToken = async (_tokenId: number) => {
    const transaction = await ethers.contracts.bid.cancelBidToken(_tokenId, {
      gasLimit,
    });
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleCancelSellToken
   * contract cancelSellToken
   *
   * @param _tokenId (uint256)
   *
   */
  const handleCancelSellToken = async (_tokenId: number) => {
    const transaction = await ethers.contracts.bid.cancelSellToken(_tokenId, {
      gasLimit,
    });
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleReadyToSellToken
   * contract readyToSellToken
   *
   * @param _tokenId (uint256)
   * @param _price (uint256)
   * @param _quoteTokenAddr (address)
   *
   */
  const handleReadyToSellToken = async (
    _tokenId: number,
    _price: number,
    _quoteTokenAddr: string
  ) => {
    const transaction = await ethers.contracts.bid.readyToSellToken(
      _tokenId,
      _price,
      _quoteTokenAddr,
      {
        gasLimit,
      }
    );
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleReadyToSellTokenTo
   * contract readyToSellTokenTo
   *
   * @param _tokenId (uint256)
   * @param _price (uint256)
   * @param _quoteTokenAddr (address)
   * @param _to (address)
   *
   */
  const handleReadyToSellTokenTo = async (
    _tokenId: number,
    _price: number,
    _quoteTokenAddr: string,
    _to: string
  ) => {
    const transaction = await ethers.contracts.bid.readyToSellTokenTo(
      _tokenId,
      _price,
      _quoteTokenAddr,
      _to,
      {
        gasLimit,
      }
    );
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleSellTokenTo
   * contract sellTokenTo
   *
   * @param _tokenId (uint256)
   * @param _to (address)
   *
   */
  const handleSellTokenTo = async (_tokenId: number, _to: string) => {
    const transaction = await ethers.contracts.bid.sellTokenTo(_tokenId, _to, {
      gasLimit,
    });
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleSetCurrentPrice
   * contract setCurrentPrice
   *
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
    const transaction = await ethers.contracts.bid.setCurrentPrice(
      _tokenId,
      _price,
      _quoteTokenAddr,
      {
        gasLimit,
      }
    );
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleUpdateBidPrice
   * contract updateBidPrice
   *
   * @param _tokenId (uint256)
   * @param _price (uint256)
   *
   */
  const handleUpdateBidPrice = async (_tokenId: number, _price: number) => {
    const transaction = await ethers.contracts.bid.updateBidPrice(
      _tokenId,
      _price,
      {
        gasLimit,
      }
    );
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleGetBids
   * contract getBids
   *
   * @param _tokenId (uint256)
   *
   */
  const handleGetBids = async (_tokenId: number) => {
    const transaction = await ethers.contracts.bid.getBids(_tokenId, {
      gasLimit,
    });
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  /**
   * function handleGetUserBids
   * contract getUserBids
   *
   * @param user (address)
   *
   */
  const handleGetUserBids = async (user: string) => {
    const transaction = await ethers.contracts.bid.getUserBids(user, {
      gasLimit,
    });
    const tx = await transaction.wait();
    console.log("transaction", tx);
  };

  return <Fragment>xx</Fragment>;
}
